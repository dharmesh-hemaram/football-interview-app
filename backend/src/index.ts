import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { mockTeams, mockPlayers, mockMatches } from './db';
import type { Match, Notification } from './types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
let teams = structuredClone(mockTeams);
let players = structuredClone(mockPlayers);
let matches = structuredClone(mockMatches);

// ============= PLAYERS ENDPOINTS =============
app.get('/api/players', (req, res) => {
  res.json({
    success: true,
    data: players,
  });
});

app.get('/api/players/:id', (req, res) => {
  const player = players.find((p) => p.id === req.params.id);
  if (!player) {
    return res.status(404).json({
      success: false,
      error: 'Player not found',
    });
  }
  res.json({
    success: true,
    data: player,
  });
});

app.put('/api/players/:id', (req, res) => {
  const player = players.find((p) => p.id === req.params.id);
  if (!player) {
    return res.status(404).json({
      success: false,
      error: 'Player not found',
    });
  }
  const updatedPlayer = { ...player, ...req.body };
  const index = players.findIndex((p) => p.id === req.params.id);
  players[index] = updatedPlayer;
  res.json({
    success: true,
    data: updatedPlayer,
  });
});

// ============= TEAMS ENDPOINTS =============
app.get('/api/teams', (req, res) => {
  res.json({
    success: true,
    data: teams,
  });
});

app.get('/api/teams/:id', (req, res) => {
  const team = teams.find((t) => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found',
    });
  }
  res.json({
    success: true,
    data: team,
  });
});

app.put('/api/teams/:id', (req, res) => {
  const team = teams.find((t) => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found',
    });
  }
  const updatedTeam = { ...team, ...req.body };
  const index = teams.findIndex((t) => t.id === req.params.id);
  teams[index] = updatedTeam;
  res.json({
    success: true,
    data: updatedTeam,
  });
});

// ============= MATCHES ENDPOINTS =============
app.get('/api/matches', (req, res) => {
  res.json({
    success: true,
    data: matches,
  });
});

app.get('/api/matches/:id', (req, res) => {
  const match = matches.find((m) => m.id === req.params.id);
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found',
    });
  }
  res.json({
    success: true,
    data: match,
  });
});

app.put('/api/matches/:id', (req, res) => {
  const match = matches.find((m) => m.id === req.params.id);
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found',
    });
  }
  const updatedMatch = { ...match, ...req.body };
  const index = matches.findIndex((m) => m.id === req.params.id);
  matches[index] = updatedMatch;
  res.json({
    success: true,
    data: updatedMatch,
  });
});

// ============= WEBSOCKET SETUP =============
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Subscribe to live updates
  socket.on('subscribe:liveUpdates', (matchId: string) => {
    socket.join(`match-${matchId}`);
    console.log(`Client ${socket.id} subscribed to match ${matchId}`);
  });

  socket.on('unsubscribe:liveUpdates', (matchId: string) => {
    socket.leave(`match-${matchId}`);
    console.log(`Client ${socket.id} unsubscribed from match ${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate live match updates - broadcast to all clients every 15 seconds
setInterval(() => {
  const liveMatch = matches.find((m) => m.status === 'live');
  if (!liveMatch) return;

  const homeTeam = teams.find((t) => t.id === liveMatch.homeTeamId);
  const awayTeam = teams.find((t) => t.id === liveMatch.awayTeamId);
  const homePlayers = players.filter((p) => p.teamId === liveMatch.homeTeamId && p.position !== 'GK');
  const awayPlayers = players.filter((p) => p.teamId === liveMatch.awayTeamId && p.position !== 'GK');

  const roll = Math.random();
  let notification: Notification;

  if (roll < 0.40) {
    // Home team goal
    const scorer = homePlayers[Math.floor(Math.random() * homePlayers.length)];
    liveMatch.homeScore += 1;
    notification = {
      id: uuid(),
      type: 'goal',
      title: '⚽ GOAL!',
      message: `${scorer.name} scores for ${homeTeam?.shortName ?? homeTeam?.name}! ${homeTeam?.shortName} ${liveMatch.homeScore}–${liveMatch.awayScore} ${awayTeam?.shortName}`,
      timestamp: Date.now(),
      matchId: liveMatch.id,
      read: false,
    };
  } else if (roll < 0.70) {
    // Away team goal
    const scorer = awayPlayers[Math.floor(Math.random() * awayPlayers.length)];
    liveMatch.awayScore += 1;
    notification = {
      id: uuid(),
      type: 'goal',
      title: '⚽ GOAL!',
      message: `${scorer.name} scores for ${awayTeam?.shortName ?? awayTeam?.name}! ${homeTeam?.shortName} ${liveMatch.homeScore}–${liveMatch.awayScore} ${awayTeam?.shortName}`,
      timestamp: Date.now(),
      matchId: liveMatch.id,
      read: false,
    };
  } else if (roll < 0.88) {
    // Yellow card
    const allOutfield = [...homePlayers, ...awayPlayers];
    const player = allOutfield[Math.floor(Math.random() * allOutfield.length)];
    const playerTeam = teams.find((t) => t.id === player.teamId);
    notification = {
      id: uuid(),
      type: 'match_update',
      title: '🟨 Yellow Card',
      message: `${player.name} (${playerTeam?.shortName}) has been booked`,
      timestamp: Date.now(),
      matchId: liveMatch.id,
      read: false,
    };
  } else {
    // Red card
    const allOutfield = [...homePlayers, ...awayPlayers];
    const player = allOutfield[Math.floor(Math.random() * allOutfield.length)];
    const playerTeam = teams.find((t) => t.id === player.teamId);
    notification = {
      id: uuid(),
      type: 'red_card',
      title: '🟥 Red Card',
      message: `${player.name} (${playerTeam?.shortName}) has been sent off!`,
      timestamp: Date.now(),
      matchId: liveMatch.id,
      read: false,
    };
  }

  io.emit('notification', notification);
}, 15000);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🏆 Football API Server running on http://localhost:${PORT}`);
  console.log(`WebSocket ready on ws://localhost:${PORT}`);
});
