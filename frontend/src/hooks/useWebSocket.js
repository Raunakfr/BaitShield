import { useState, useEffect, useRef } from 'react';

export function useWebSocket(urlOrCallback, callback) {
  let wsUrl = typeof urlOrCallback === 'string' ? urlOrCallback : null;
  let onMessage = typeof urlOrCallback === 'function' ? urlOrCallback : callback;

  if (!wsUrl) {
    const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
    wsUrl = `ws://${host}:3001`;
  }

  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const onMessageRef = useRef(onMessage);

  // Keep latest onMessage callback without triggering useEffect re-runs
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!wsUrl) return;

    const connect = () => {
      // Prevent opening duplicate WebSocket connections
      if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
        return;
      }

      try {
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          setConnected(true);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (onMessageRef.current) {
              onMessageRef.current(parsed);
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        wsRef.current.onclose = () => {
          setConnected(false);
          reconnectTimeoutRef.current = setTimeout(connect, 2000);
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket connection error:', error);
          if (wsRef.current) {
            wsRef.current.close();
          }
        };
      } catch (e) {
        console.error('WebSocket initialization error:', e);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [wsUrl]);

  return { connected };
}
