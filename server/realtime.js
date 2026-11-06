/**
 * Real-Time Synchronization Engine
 * Handles bi-directional WebSockets and SSE for instant portfolio synchronization,
 * live multi-tab updates, and real-time client viewer activity tracking.
 */

import { WebSocketServer, WebSocket } from 'ws';

class RealtimeHub {
  constructor() {
    this.wss = null;
    // Map of connectionId -> { ws, role, username, pitchSlug, connectedAt }
    this.clients = new Map();
    // SSE response objects: username -> Set of res
    this.sseClients = new Map();
  }

  init(server) {
    this.wss = new WebSocketServer({ server, path: '/api/ws' });

    this.wss.on('connection', (ws, req) => {
      const clientId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const clientMeta = {
        id: clientId,
        ws,
        role: 'viewer', // 'creator' or 'viewer'
        username: 'alexchen',
        pitchSlug: null,
        ip: req.socket.remoteAddress || '127.0.0.1',
        connectedAt: Date.now()
      };

      this.clients.set(clientId, clientMeta);

      // Send initial handshake acknowledgement
      this.sendSafe(ws, {
        type: 'CONNECTED',
        clientId,
        serverTime: Date.now(),
        message: 'Real-time WebSocket pipeline active'
      });

      ws.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          this.handleClientMessage(clientId, msg);
        } catch (err) {
          console.warn('Realtime message parse error:', err.message);
        }
      });

      ws.on('close', () => {
        const meta = this.clients.get(clientId);
        this.clients.delete(clientId);
        if (meta) {
          this.broadcastViewerCount(meta.username);
        }
      });

      ws.on('error', (err) => {
        console.warn(`Realtime client error [${clientId}]:`, err.message);
        this.clients.delete(clientId);
      });
    });

    console.log('⚡ Real-time WebSocket Server initialized on /api/ws');
  }

  handleClientMessage(clientId, msg) {
    const meta = this.clients.get(clientId);
    if (!meta) return;

    switch (msg.action || msg.type) {
      case 'REGISTER_ROLE': {
        meta.role = msg.role || 'viewer';
        meta.username = (msg.username || 'alexchen').toLowerCase();
        meta.pitchSlug = msg.pitchSlug || null;
        meta.clientName = msg.clientName || 'Anonymous Visitor';

        // Notify creator studio of visitor connection
        if (meta.role === 'viewer') {
          this.notifyCreator(meta.username, {
            type: 'CLIENT_ENTERED',
            title: '⚡ Prospective Client Online',
            description: meta.pitchSlug 
              ? `Client opened tailored pitch: "${meta.pitchSlug}"`
              : `Visitor opened your live portfolio @${meta.username}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            pitchSlug: meta.pitchSlug
          });
        }

        this.broadcastViewerCount(meta.username);
        break;
      }

      case 'VIDEO_PLAY': {
        const username = meta.username;
        this.notifyCreator(username, {
          type: 'CLIENT_VIDEO_PLAY',
          title: '🎬 Video Reel Interaction',
          description: `Client started playing "${msg.videoTitle || 'Reel'}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          videoTitle: msg.videoTitle,
          duration: msg.duration
        });
        break;
      }

      case 'INQUIRY_SUBMITTED': {
        const username = meta.username;
        this.notifyCreator(username, {
          type: 'CLIENT_INQUIRY',
          title: '💰 High-Intent Retainer Inquiry!',
          description: `${msg.clientName || 'Prospective Client'} selected package: "${msg.packageName || 'Commercial Package'}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          packageName: msg.packageName,
          email: msg.email
        });
        break;
      }

      case 'PING': {
        this.sendSafe(meta.ws, { type: 'PONG', timestamp: Date.now() });
        break;
      }

      default:
        break;
    }
  }

  /**
   * Broadcast state changes (e.g. Copilot edits, Omni scrapes, Antigravity undo/redo)
   * to all connected tabs (both public viewers and other studio tabs).
   */
  broadcastPortfolioUpdate(username, { portfolio, meta, trigger }) {
    const u = username.toLowerCase();
    const payload = {
      type: 'PORTFOLIO_UPDATED',
      username: u,
      portfolio,
      meta,
      trigger,
      timestamp: Date.now()
    };

    // Broadcast to WebSockets
    for (const [, client] of this.clients.entries()) {
      if (client.username === u && client.ws.readyState === WebSocket.OPEN) {
        this.sendSafe(client.ws, payload);
      }
    }

    // Broadcast to SSE clients
    this.broadcastSSE(u, payload);
  }

  /**
   * Push real-time toast notification to creator studio(s)
   */
  notifyCreator(username, notification) {
    const u = username.toLowerCase();
    const payload = {
      type: 'CREATOR_ACTIVITY_FEED',
      notification,
      timestamp: Date.now()
    };

    for (const [, client] of this.clients.entries()) {
      if (client.username === u && client.role === 'creator' && client.ws.readyState === WebSocket.OPEN) {
        this.sendSafe(client.ws, payload);
      }
    }

    this.broadcastSSE(u, payload);
  }

  /**
   * Calculate and broadcast current live viewers on this creator's domain
   */
  broadcastViewerCount(username) {
    const u = username.toLowerCase();
    let count = 0;
    for (const [, client] of this.clients.entries()) {
      if (client.username === u && client.role === 'viewer') {
        count++;
      }
    }

    if (this.lastCounts && this.lastCounts.get(u) === count) return;
    if (!this.lastCounts) this.lastCounts = new Map();
    this.lastCounts.set(u, count);

    const payload = {
      type: 'ACTIVE_VIEWERS_UPDATE',
      username: u,
      count,
      timestamp: Date.now()
    };

    for (const [, client] of this.clients.entries()) {
      if (client.username === u && client.ws.readyState === WebSocket.OPEN) {
        this.sendSafe(client.ws, payload);
      }
    }

    this.broadcastSSE(u, payload);
  }

  getActiveViewersCount(username) {
    const u = username.toLowerCase();
    let count = 0;
    for (const [, client] of this.clients.entries()) {
      if (client.username === u && client.role === 'viewer') count++;
    }
    return count;
  }

  sendSafe(ws, data) {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    } catch (err) {
      console.warn('WS send failed:', err.message);
    }
  }

  // SSE Fallback Handling
  addSSEClient(username, res) {
    const u = username.toLowerCase();
    if (!this.sseClients.has(u)) {
      this.sseClients.set(u, new Set());
    }
    this.sseClients.get(u).add(res);

    res.on('close', () => {
      const set = this.sseClients.get(u);
      if (set) {
        set.delete(res);
        if (set.size === 0) this.sseClients.delete(u);
      }
    });
  }

  broadcastSSE(username, data) {
    const set = this.sseClients.get(username.toLowerCase());
    if (set) {
      const msg = `data: ${JSON.stringify(data)}\n\n`;
      for (const res of set) {
        try {
          res.write(msg);
        } catch {
          set.delete(res);
        }
      }
    }
  }
}

export const realtimeHub = new RealtimeHub();
