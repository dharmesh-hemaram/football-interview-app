import { v4 as uuid } from 'uuid';
import { createApp } from './app.js';
import type { Notification } from './types.js';

const { app: _app, httpServer, io, getState } = createApp();

// Simulate live match updates — broadcast to all clients every 15 seconds
setInterval(() => {
  const { teams, players, matches } = getState();
  const liveMatch = matches.find((m) => m.status === 'live');
  if (!liveMatch) return;

  const homeTeam = teams.find((t) => t.id === liveMatch.homeTeamId);
  const awayTeam = teams.find((t) => t.id === liveMatch.awayTeamId);
  const homePlayers = players.filter((p) => p.teamId === liveMatch.homeTeamId && p.position !== 'GK');
  const awayPlayers = players.filter((p) => p.teamId === liveMatch.awayTeamId && p.position !== 'GK');

  const roll = Math.random();
  let notification: Notification;

  if (roll < 0.40) {
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

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🏆 Football API Server running on http://localhost:${PORT}`);
  console.log(`WebSocket ready on ws://localhost:${PORT}`);
});
