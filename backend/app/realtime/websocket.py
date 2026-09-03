import json
import logging
from typing import Set
from fastapi import WebSocket
from app.models.schemas import EventEnvelope

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket client connected (Total active: {len(self.active_connections)})")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket client disconnected (Total active: {len(self.active_connections)})")

    async def broadcast_event(self, event: EventEnvelope):
        data = event.model_dump()
        for connection in tuple(self.active_connections):
            try:
                await connection.send_json(data)
            except Exception as e:
                logger.warning(f"Error sending WebSocket message: {e}")
                self.disconnect(connection)

ws_manager = WebSocketManager()
