import { useEffect, useRef, useState, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = (
  url: string | null,
  options: UseWebSocketOptions = {}
) => {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isManualCloseRef = useRef(false);

  const connect = useCallback(() => {
    if (!url || wsRef.current?.readyState === WebSocket.OPEN) return;

    setIsConnecting(true);
    isManualCloseRef.current = false;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        reconnectCountRef.current = 0;
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnect?.();

        // Attempt reconnection if not manually closed
        if (!isManualCloseRef.current && reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
      };
    } catch (error) {
      setIsConnecting(false);
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [url, onMessage, onConnect, onDisconnect, onError, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    isManualCloseRef.current = true;
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (url) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendMessage
  };
};

// Specialized hook for tracking grievances
export const useTrackingWebSocket = (gridId: string | null) => {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [liveUpdates, setLiveUpdates] = useState<any[]>([]);
  const [eta, setEta] = useState<string | null>(null);
  const [teamLocation, setTeamLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getWsUrl = () => {
    if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  };

  const wsUrl = gridId ? `${getWsUrl()}/ws/track/${gridId}` : null;

  const { isConnected, isConnecting } = useWebSocket(wsUrl, {
    onMessage: (message) => {
      switch (message.type) {
        case "status_update":
          setLiveUpdates(prev => [message.data, ...prev]);
          break;
        case "eta_update":
          setEta(message.data.eta);
          break;
        case "team_location":
          setTeamLocation({ lat: message.data.lat, lng: message.data.lng });
          break;
        case "full_update":
          setTrackingData(message.data);
          break;
        default:
          console.log("Unknown message type:", message.type);
      }
    }
  });

  return {
    isConnected,
    isConnecting,
    trackingData,
    liveUpdates,
    eta,
    teamLocation
  };
};

// Mock WebSocket hook for development
export const useMockTrackingWebSocket = (gridId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState<any[]>([]);
  const [eta, setEta] = useState<string | null>("15 minutes");
  const [teamLocation, setTeamLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 28.6145,
    lng: 77.2095
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!gridId) return;

    setIsConnecting(true);
    
    // Simulate connection delay
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1000);

    // Simulate live updates every 10 seconds
    intervalRef.current = setInterval(() => {
      const updates = [
        { type: "status_update", message: "Team is en route", timestamp: new Date().toISOString() },
        { type: "eta_update", message: "ETA updated to 12 minutes", timestamp: new Date().toISOString() },
        { type: "team_location", message: "Team location updated", timestamp: new Date().toISOString() },
      ];
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      setLiveUpdates(prev => [randomUpdate, ...prev].slice(0, 10));
      
      // Update team location slightly
      setTeamLocation(prev => prev ? {
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      } : prev);
    }, 10000);

    return () => {
      clearTimeout(connectTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [gridId]);

  return {
    isConnected,
    isConnecting,
    liveUpdates,
    eta,
    teamLocation
  };
};

export default useWebSocket;
