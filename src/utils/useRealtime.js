import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useRealtime Hook
 * High-performance, leak-free real-time synchronization engine.
 * Stabilized against React re-renders and StrictMode double-mounting.
 */
export function useRealtime({
  role = 'viewer', // 'creator' | 'viewer'
  username = 'alexchen',
  pitchSlug = null,
  clientName = 'Anonymous Visitor',
  onPortfolioUpdated = null,
  onCreatorActivity = null,
  onViewersUpdate = null
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [activeViewers, setActiveViewers] = useState(0);

  // Keep latest callbacks in refs so changing functions never triggers reconnects
  const onPortfolioUpdatedRef = useRef(onPortfolioUpdated);
  const onCreatorActivityRef = useRef(onCreatorActivity);
  const onViewersUpdateRef = useRef(onViewersUpdate);

  useEffect(() => {
    onPortfolioUpdatedRef.current = onPortfolioUpdated;
    onCreatorActivityRef.current = onCreatorActivity;
    onViewersUpdateRef.current = onViewersUpdate;
  });

  const wsRef = useRef(null);
  const sseRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);

  const cleanupConnections = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      const socket = wsRef.current;
      wsRef.current = null;
      try {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        } else if (socket.readyState === WebSocket.CONNECTING) {
          // If still connecting (common in React StrictMode), wait until open to close gracefully
          socket.onopen = () => socket.close();
        }
      } catch {}
    }
    if (sseRef.current) {
      try {
        sseRef.current.onmessage = null;
        sseRef.current.onerror = null;
        sseRef.current.close();
      } catch {}
      sseRef.current = null;
    }
  }, []);

  const startSSEFallback = useCallback(() => {
    if (isUnmountedRef.current || sseRef.current) return;

    try {
      const cleanUser = (username || 'sathasivamb').toLowerCase();
      const sse = new EventSource(`/api/realtime/stream/${cleanUser}`);
      sseRef.current = sse;

      sse.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'PORTFOLIO_UPDATED') {
            onPortfolioUpdatedRef.current?.(data);
          }
          if (data.type === 'CREATOR_ACTIVITY_FEED') {
            onCreatorActivityRef.current?.(data.notification);
          }
          if (data.type === 'ACTIVE_VIEWERS_UPDATE') {
            setActiveViewers(data.count || 0);
            onViewersUpdateRef.current?.(data.count || 0);
          }
        } catch {}
      };

      sse.onerror = () => {
        if (sseRef.current) {
          sseRef.current.close();
          sseRef.current = null;
        }
      };

      setIsConnected(true);
    } catch {}
  }, [username]);

  const connect = useCallback(() => {
    if (isUnmountedRef.current) return;
    cleanupConnections();

    try {
      const isHttps = window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/api/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) {
          ws.close();
          return;
        }
        setIsConnected(true);
        ws.send(JSON.stringify({
          action: 'REGISTER_ROLE',
          role,
          username: (username || 'sathasivamb').toLowerCase(),
          pitchSlug,
          clientName
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'PORTFOLIO_UPDATED':
              onPortfolioUpdatedRef.current?.(data);
              break;
            case 'CREATOR_ACTIVITY_FEED':
              onCreatorActivityRef.current?.(data.notification);
              break;
            case 'ACTIVE_VIEWERS_UPDATE':
              setActiveViewers(data.count || 0);
              onViewersUpdateRef.current?.(data.count || 0);
              break;
            default:
              break;
          }
        } catch (err) {
          console.warn('Realtime message parse error:', err);
        }
      };

      ws.onclose = () => {
        if (isUnmountedRef.current) return;
        setIsConnected(false);
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(connect, 6000);
        }
      };

      ws.onerror = () => {
        if (!isUnmountedRef.current && !sseRef.current) {
          startSSEFallback();
        }
      };
    } catch {
      startSSEFallback();
    }
  }, [role, username, pitchSlug, clientName, cleanupConnections, startSSEFallback]);

  // Connect only when identity parameters change (role, username, pitchSlug), NOT on every render
  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      cleanupConnections();
    };
  }, [role, username, pitchSlug, clientName, connect, cleanupConnections]);

  // Client actions
  const emitVideoPlay = useCallback((videoTitle, duration) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'VIDEO_PLAY',
        videoTitle,
        duration
      }));
    }
  }, []);

  const emitInquiry = useCallback((packageName, email, clientName) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'INQUIRY_SUBMITTED',
        packageName,
        email,
        clientName
      }));
    }
  }, []);

  return {
    isConnected,
    activeViewers,
    emitVideoPlay,
    emitInquiry
  };
}
