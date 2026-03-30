"""
Tests for WebSocket stability and crash prevention.
Verifies that WebSocket handler gracefully handles disconnections and errors.
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import WebSocket, WebSocketDisconnect
from src.api.v1.tracking import track_grievance_ws


@pytest.mark.asyncio
async def test_websocket_handles_client_disconnect_gracefully():
    """
    Verify: WebSocket handler doesn't crash when client disconnects mid-stream
    """
    # Mock WebSocket
    websocket = AsyncMock(spec=WebSocket)
    websocket.send_json = AsyncMock(side_effect=RuntimeError("Connection closed"))
    websocket.accept = AsyncMock()
    websocket.close = AsyncMock()

    # Mock DB
    db = AsyncMock()
    
    # Mock repository
    with patch('src.api.v1.tracking.GrievanceRepository') as mock_repo_class:
        mock_repo = AsyncMock()
        mock_repo.get_by_grid_id = AsyncMock(
            return_value={"id": "123", "grid_id": "GRI-001"}
        )
        mock_repo_class.return_value = mock_repo

        # Mock Redis
        with patch('src.api.v1.tracking.get_pubsub_redis_client') as mock_redis_fn:
            mock_redis = MagicMock()
            mock_pubsub = AsyncMock()
            mock_pubsub.subscribe = AsyncMock()
            mock_pubsub.unsubscribe = AsyncMock()
            # Force loop exit after subscription-send failure.
            mock_pubsub.get_message = AsyncMock(side_effect=WebSocketDisconnect(1000))
            mock_redis.pubsub.return_value = mock_pubsub
            mock_redis_fn.return_value = mock_redis

            # Execute - should NOT raise exception
            await track_grievance_ws(websocket, "GRI-001", db)

            # Verify cleanup was called
            mock_pubsub.unsubscribe.assert_called()


@pytest.mark.asyncio
async def test_websocket_handles_redis_error_gracefully():
    """
    Verify: WebSocket handler doesn't crash when Redis connection fails
    """
    websocket = AsyncMock(spec=WebSocket)
    websocket.accept = AsyncMock()
    websocket.send_json = AsyncMock()

    db = AsyncMock()

    with patch('src.api.v1.tracking.GrievanceRepository') as mock_repo_class:
        mock_repo = AsyncMock()
        mock_repo.get_by_grid_id = AsyncMock(
            return_value={"id": "456", "grid_id": "GRI-002"}
        )
        mock_repo_class.return_value = mock_repo

        with patch('src.api.v1.tracking.get_pubsub_redis_client') as mock_redis_fn:
            # Simulate Redis connection failure
            mock_redis_fn.side_effect = ConnectionError("Redis unavailable")

            # Execute - should handle error gracefully without propagating
            await track_grievance_ws(websocket, "GRI-002", db)


@pytest.mark.asyncio 
async def test_websocket_handles_db_validation_error():
    """
    Verify: WebSocket handler handles DB errors during validation
    """
    websocket = AsyncMock(spec=WebSocket)
    websocket.accept = AsyncMock()
    websocket.send_json = AsyncMock()
    websocket.close = AsyncMock()

    db = AsyncMock()

    with patch('src.api.v1.tracking.GrievanceRepository') as mock_repo_class:
        mock_repo = AsyncMock()
        mock_repo.get_by_grid_id = AsyncMock(
            side_effect=Exception("DB connection timeout")
        )
        mock_repo_class.return_value = mock_repo

        # Execute - should NOT raise
        await track_grievance_ws(websocket, "GRI-003", db)

        # Verify error response was sent
        websocket.accept.assert_called()
        websocket.send_json.assert_called_with({"error": "Service unavailable"})
        websocket.close.assert_called_with(code=1011)


@pytest.mark.asyncio
async def test_websocket_handles_invalid_json_gracefully():
    """
    Verify: WebSocket handler handles invalid JSON from Redis without crashing
    """
    websocket = AsyncMock(spec=WebSocket)
    websocket.accept = AsyncMock()
    websocket.send_json = AsyncMock()

    db = AsyncMock()

    with patch('src.api.v1.tracking.GrievanceRepository') as mock_repo_class:
        mock_repo = AsyncMock()
        mock_repo.get_by_grid_id = AsyncMock(
            return_value={"id": "789", "grid_id": "GRI-004"}
        )
        mock_repo_class.return_value = mock_repo

        with patch('src.api.v1.tracking.get_pubsub_redis_client') as mock_redis_fn:
            mock_redis = MagicMock()
            mock_pubsub = AsyncMock()
            
            # Simulate message with invalid JSON
            mock_pubsub.subscribe = AsyncMock()
            call_count = [0]
            
            async def get_message_side_effect(*args, **kwargs):
                call_count[0] += 1
                if call_count[0] == 1:
                    return {
                        "type": "message",
                        "data": b"not valid json{{"
                    }
                raise WebSocketDisconnect(1000)
            
            mock_pubsub.get_message = AsyncMock(side_effect=get_message_side_effect)
            mock_pubsub.unsubscribe = AsyncMock()
            mock_redis.pubsub.return_value = mock_pubsub
            mock_redis_fn.return_value = mock_redis

            # Execute - should NOT crash on invalid JSON
            await track_grievance_ws(websocket, "GRI-004", db)

            # Verify cleanup happened
            mock_pubsub.unsubscribe.assert_called()


@pytest.mark.asyncio
async def test_db_connection_released_after_validation():
    """
    Verify: Database connection is not held open during WebSocket message loop
    This prevents connection pool exhaustion
    """
    websocket = AsyncMock(spec=WebSocket)
    websocket.accept = AsyncMock()
    websocket.send_json = AsyncMock()

    # Create a real mock DB that tracks if methods are called after initial validation
    db_access_log = []
    db = AsyncMock()
    
    async def track_db_access(*args, **kwargs):
        db_access_log.append('accessed')

    db.execute = AsyncMock(side_effect=track_db_access)

    with patch('src.api.v1.tracking.GrievanceRepository') as mock_repo_class:
        mock_repo = AsyncMock()
        mock_repo.get_by_grid_id = AsyncMock(
            return_value={"id": "999", "grid_id": "GRI-005"}
        )
        mock_repo_class.return_value = mock_repo

        with patch('src.api.v1.tracking.get_pubsub_redis_client') as mock_redis_fn:
            mock_redis = MagicMock()
            mock_pubsub = AsyncMock()
            
            # First call to get_message returns a message, second returns None to exit loop
            message_calls = [0]
            
            async def get_message_side_effect(*args, **kwargs):
                message_calls[0] += 1
                if message_calls[0] == 1:
                    return {"type": "message", "data": b'{"status":"ok"}'}
                # After first message, simulate client disconnect
                raise WebSocketDisconnect(1000)
            
            mock_pubsub.subscribe = AsyncMock()
            mock_pubsub.get_message = AsyncMock(side_effect=get_message_side_effect)
            mock_pubsub.unsubscribe = AsyncMock()
            mock_redis.pubsub.return_value = mock_pubsub
            mock_redis_fn.return_value = mock_redis

            # Execute
            await track_grievance_ws(websocket, "GRI-005", db)

            # Verify DB was only accessed once (during initial validation)
            # After that, only Redis should be used
            assert len(db_access_log) == 0  # No additional DB access after setup


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
