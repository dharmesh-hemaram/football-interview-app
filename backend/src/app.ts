import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { mockTeams, mockPlayers, mockMatches } from './db.js';

export function createApp() {
  const app = express();
  const httpServer = createServer(app);
  const allowedOrigin = (origin: string | undefined) =>
    !origin ||
    /^https?:\/\/localhost:\d+$/.test(origin) ||
    /\.csb\.app$/.test(origin);

  const corsOptions = {
    origin: (origin: string | undefined, cb: (e: Error | null, ok?: boolean) => void) =>
      cb(null, allowedOrigin(origin)),
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  };

  const io = new Server(httpServer, {
    cors: corsOptions,
  });

  app.use(cors(corsOptions));
  app.use(express.json());

  // Fresh in-memory state per app instance (important for test isolation)
  let teams = structuredClone(mockTeams);
  let players = structuredClone(mockPlayers);
  let matches = structuredClone(mockMatches);

  // ── Players ───────────────────────────────────────────────────────────
  app.get('/api/players', (_req, res) => {
    res.json({ success: true, data: players });
  });

  app.get('/api/players/:id', (req, res) => {
    const player = players.find((p) => p.id === req.params.id);
    if (!player) return res.status(404).json({ success: false, error: 'Player not found' });
    res.json({ success: true, data: player });
  });

  app.put('/api/players/:id', (req, res) => {
    const idx = players.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Player not found' });
    players[idx] = { ...players[idx], ...req.body };
    res.json({ success: true, data: players[idx] });
  });

  // ── Teams ─────────────────────────────────────────────────────────────
  app.get('/api/teams', (_req, res) => {
    res.json({ success: true, data: teams });
  });

  app.get('/api/teams/:id', (req, res) => {
    const team = teams.find((t) => t.id === req.params.id);
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' });
    res.json({ success: true, data: team });
  });

  app.put('/api/teams/:id', (req, res) => {
    const idx = teams.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Team not found' });
    teams[idx] = { ...teams[idx], ...req.body };
    res.json({ success: true, data: teams[idx] });
  });

  // ── Matches ───────────────────────────────────────────────────────────
  app.get('/api/matches', (_req, res) => {
    res.json({ success: true, data: matches });
  });

  app.get('/api/matches/:id', (req, res) => {
    const match = matches.find((m) => m.id === req.params.id);
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
    res.json({ success: true, data: match });
  });

  app.put('/api/matches/:id', (req, res) => {
    const idx = matches.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Match not found' });
    matches[idx] = { ...matches[idx], ...req.body };
    res.json({ success: true, data: matches[idx] });
  });

  // ── Health ────────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // ── WebSocket ─────────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    socket.on('subscribe:liveUpdates', (matchId: string) => socket.join(`match-${matchId}`));
    socket.on('unsubscribe:liveUpdates', (matchId: string) => socket.leave(`match-${matchId}`));
  });

  return { app, httpServer, io, getState: () => ({ teams, players, matches }) };
}
