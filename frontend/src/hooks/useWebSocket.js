import { useState, useEffect, useRef } from 'react';

export function useWebSocket(url, onMessage) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const onMessageRef = useRef(onMessage);

  // Keep latest onMessage callback without triggering useEffect re-runs
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!url) return;

    const connect = () => {
      // Prevent opening duplicate WebSocket connections
      if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
        return;
      }

      wsRef.current = new WebSocket(url);

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
        console.error('WebSocket error:', error);
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
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
  }, [url]);

  return { connected };
}
