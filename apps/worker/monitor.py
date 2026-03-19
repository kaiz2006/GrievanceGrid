#!/usr/bin/env python3
"""
Monitoring utility for GrievanceGrid Worker.
Displays task queue status, worker health, and active tasks.
"""

import os
import sys
import json
from datetime import datetime, timezone
from typing import Any, Dict, List

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from celery_app import celery_app
from config import settings


def format_bytes(bytes_val: int) -> str:
    """Format bytes to human readable."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_val < 1024.0:
            return f"{bytes_val:.1f}{unit}"
        bytes_val /= 1024.0
    return f"{bytes_val:.1f}TB"


def get_worker_stats() -> Dict[str, Any]:
    """Get active worker stats."""
    inspect = celery_app.control.inspect()
    
    stats = inspect.stats()
    if not stats:
        return {}
    
    workers = {}
    for worker_name, worker_stats in stats.items():
        workers[worker_name] = {
            "pool": worker_stats.get("pool", {}).get("implementation"),
            "max_concurrency": worker_stats.get("pool", {}).get("max-concurrency"),
            "processes": worker_stats.get("pool", {}).get("processes", []),
            "memory": worker_stats.get("total", {})
        }
    
    return workers


def get_active_tasks() -> List[Dict[str, Any]]:
    """Get currently active tasks."""
    inspect = celery_app.control.inspect()
    active = inspect.active()
    
    if not active:
        return []
    
    tasks = []
    for worker_name, worker_tasks in active.items():
        for task in worker_tasks:
            tasks.append({
                "id": task.get("id"),
                "name": task.get("name"),
                "args": task.get("args"),
                "kwargs": task.get("kwargs"),
                "worker": worker_name,
                "time_start": task.get("time_start")
            })
    
    return tasks


def get_reserved_tasks() -> List[Dict[str, Any]]:
    """Get reserved/pending tasks."""
    inspect = celery_app.control.inspect()
    reserved = inspect.reserved()
    
    if not reserved:
        return []
    
    tasks = []
    for worker_name, worker_tasks in reserved.items():
        for task in worker_tasks:
            tasks.append({
                "id": task.get("id"),
                "name": task.get("name"),
                "worker": worker_name
            })
    
    return tasks


def get_registered_tasks() -> List[str]:
    """Get registered task names."""
    inspect = celery_app.control.inspect()
    registered = inspect.registered()
    
    if not registered:
        return []
    
    # Get from first worker
    for tasks in registered.values():
        return sorted(tasks)
    
    return []


def display_worker_status():
    """Display worker status."""
    print("\n" + "="*70)
    print("🔍 GrievanceGrid Worker Monitor")
    print("="*70)
    print(f"Timestamp: {datetime.now(timezone.utc).isoformat()}")
    print(f"Broker: {settings.broker_url}")
    print(f"Dry Run: {settings.dry_run}\n")
    
    # Worker stats
    print("📊 Workers")
    print("-"*70)
    workers = get_worker_stats()
    
    if not workers:
        print("❌ No workers connected!")
    else:
        for worker_name, stats in workers.items():
            print(f"\n  {worker_name}")
            if "pool" in stats:
                print(f"    Pool: {stats.get('pool')}")
                print(f"    Max Concurrency: {stats.get('max_concurrency')}")
            if stats.get("memory"):
                print(f"    Memory: {format_bytes(int(stats.get('memory')))}")
    
    # Active tasks
    print("\n\n⚙️  Active Tasks")
    print("-"*70)
    active = get_active_tasks()
    
    if not active:
        print("  No active tasks")
    else:
        for i, task in enumerate(active, 1):
            print(f"\n  {i}. Task: {task.get('name')}")
            print(f"     ID: {task.get('id')[:8]}...")
            print(f"     Worker: {task.get('worker')}")
            if task.get('time_start'):
                import time as time_module
                elapsed = time_module.time() - task.get('time_start')
                print(f"     Running: {elapsed:.1f}s")
    
    # Reserved tasks
    print("\n\n📋 Reserved Tasks (Pending)")
    print("-"*70)
    reserved = get_reserved_tasks()
    
    if not reserved:
        print("  No reserved tasks")
    else:
        # Group by task name
        by_name = {}
        for task in reserved:
            name = task.get('name', 'unknown').split('.')[-1]
            by_name[name] = by_name.get(name, 0) + 1
        
        for name, count in sorted(by_name.items()):
            print(f"  {name}: {count} waiting")
    
    # Registered tasks
    print("\n\n📝 Registered Tasks")
    print("-"*70)
    registered = get_registered_tasks()
    
    if not registered:
        print("  No registered tasks")
    else:
        for task in registered:
            # Extract short name
            short_name = task.split('.')[-1]
            print(f"  ✓ {short_name}")
    
    # Summary
    print("\n\n📈 Summary")
    print("-"*70)
    print(f"  Workers: {len(workers)}")
    print(f"  Active Tasks: {len(active)}")
    print(f"  Pending Tasks: {len(reserved)}")
    print(f"  Registered Tasks: {len(registered)}")
    
    print("\n" + "="*70 + "\n")


def display_queue_info():
    """Display queue configuration."""
    print("\n🔌 Queue Configuration")
    print("-"*70)
    
    routes = celery_app.conf.task_routes
    if callable(routes):
        print("  Dynamic routing configured")
    else:
        for pattern, route in routes.items():
            queue = route.get('queue', 'default')
            print(f"  {pattern} → {queue}")


def display_schedule_info():
    """Display scheduled tasks."""
    print("\n⏰ Scheduled Tasks (Beat)")
    print("-"*70)
    
    schedule = celery_app.conf.beat_schedule
    for name, config in schedule.items():
        task = config.get('task', '').split('.')[-1]
        schedule_val = config.get('schedule')
        
        if hasattr(schedule_val, 'is_due'):
            # It's a crontab
            print(f"  {task}: {schedule_val}")
        else:
            # Numeric seconds
            print(f"  {task}: every {schedule_val}s")


def main():
    """Main monitor."""
    show_all = len(sys.argv) > 1 and sys.argv[1] == "--all"
    
    try:
        display_worker_status()
        
        if show_all:
            display_queue_info()
            display_schedule_info()
        
        print("✅ Monitor update complete")
        print("\nTip: Use 'celery -A src.celery_app inspect active' for more details")
        print("     Or run 'docker run ... flower' for web UI\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
