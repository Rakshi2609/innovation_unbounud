import asyncio
import logging
from typing import Set, Optional
from datetime import datetime, timezone
from app.models.schemas import EventEnvelope

logger = logging.getLogger(__name__)

class EventBus:
    """
    Asynchronous in-memory event bus adapted from the E-mrg operational engine.
    Maintains sequential message ordering and multi-consumer pub/sub.
    """
    def __init__(self):
        self._subscribers: Set[asyncio.Queue[EventEnvelope]] = set()
        self._sequence = 0
        self._history: list[EventEnvelope] = []

    def subscribe(self) -> asyncio.Queue[EventEnvelope]:
        queue: asyncio.Queue[EventEnvelope] = asyncio.Queue()
        self._subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue[EventEnvelope]) -> None:
        self._subscribers.discard(queue)

    async def publish(self, case_id: str, event_type: str, payload: dict) -> EventEnvelope:
        self._sequence += 1
        event = EventEnvelope(
            version=1,
            event_id=f"EVT-{self._sequence:06d}",
            sequence=self._sequence,
            occurred_at=datetime.now(timezone.utc).isoformat(),
            case_id=case_id,
            event_type=event_type,
            payload=payload
        )
        self._history.append(event)
        if len(self._history) > 500:
            self._history.pop(0)

        for queue in tuple(self._subscribers):
            try:
                await queue.put(event)
            except Exception as e:
                logger.error(f"Failed delivering event to subscriber: {e}")
        return event

    def get_recent_events(self, limit: int = 50) -> list[EventEnvelope]:
        return self._history[-limit:]

event_bus = EventBus()
