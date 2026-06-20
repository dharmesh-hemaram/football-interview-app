import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../src/app';

describe('Matches API', () => {
  let request: ReturnType<typeof supertest>;

  beforeEach(() => {
    const { app } = createApp();
    request = supertest(app);
  });

  describe('GET /api/matches', () => {
    it('returns 200 with success flag', async () => {
      const res = await request.get('/api/matches');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns all 6 matches', async () => {
      const res = await request.get('/api/matches');
      expect(res.body.data).toHaveLength(6);
    });

    it('returns matches with correct shape including events', async () => {
      const res = await request.get('/api/matches');
      const match = res.body.data[0];
      expect(match).toHaveProperty('id');
      expect(match).toHaveProperty('homeTeamId');
      expect(match).toHaveProperty('awayTeamId');
      expect(match).toHaveProperty('date');
      expect(match).toHaveProperty('status');
      expect(match).toHaveProperty('homeScore');
      expect(match).toHaveProperty('awayScore');
      expect(match).toHaveProperty('events');
      expect(Array.isArray(match.events)).toBe(true);
    });

    it('has exactly one live match', async () => {
      const res = await request.get('/api/matches');
      const liveMatches = res.body.data.filter((m: any) => m.status === 'live');
      expect(liveMatches).toHaveLength(1);
    });

    it('has exactly one scheduled match', async () => {
      const res = await request.get('/api/matches');
      const scheduled = res.body.data.filter((m: any) => m.status === 'scheduled');
      expect(scheduled).toHaveLength(1);
    });

    it('has at least 4 completed matches', async () => {
      const res = await request.get('/api/matches');
      const completed = res.body.data.filter((m: any) => m.status === 'completed');
      expect(completed.length).toBeGreaterThanOrEqual(4);
    });

    it('match events contain correct types', async () => {
      const res = await request.get('/api/matches');
      const validTypes = ['goal', 'yellow_card', 'red_card', 'own_goal', 'penalty'];
      res.body.data.forEach((match: any) => {
        match.events.forEach((event: any) => {
          expect(validTypes).toContain(event.type);
          expect(typeof event.minute).toBe('number');
          expect(event.minute).toBeGreaterThan(0);
          expect(event.minute).toBeLessThanOrEqual(90);
        });
      });
    });

    it('Liverpool vs Tottenham match has Romero red card', async () => {
      const res = await request.get('/api/matches/match-2');
      const match = res.body.data;
      const redCards = match.events.filter((e: any) => e.type === 'red_card');
      expect(redCards).toHaveLength(1);
      expect(redCards[0].playerId).toBe('player-t2'); // Cristian Romero
      expect(redCards[0].minute).toBe(88);
    });
  });

  describe('GET /api/matches/:id', () => {
    it('returns match-1 (Arsenal vs Chelsea)', async () => {
      const res = await request.get('/api/matches/match-1');
      expect(res.status).toBe(200);
      expect(res.body.data.homeTeamId).toBe('team-ars');
      expect(res.body.data.awayTeamId).toBe('team-che');
      expect(res.body.data.homeScore).toBe(2);
      expect(res.body.data.awayScore).toBe(1);
      expect(res.body.data.status).toBe('completed');
    });

    it('returns the live match (match-5)', async () => {
      const res = await request.get('/api/matches/match-5');
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('live');
    });

    it('returns 404 for unknown match', async () => {
      const res = await request.get('/api/matches/match-99');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/matches/:id', () => {
    it('updates match score', async () => {
      const res = await request
        .put('/api/matches/match-5')
        .send({ homeScore: 2, awayScore: 1 });
      expect(res.status).toBe(200);
      expect(res.body.data.homeScore).toBe(2);
      expect(res.body.data.awayScore).toBe(1);
    });

    it('updates match status to completed', async () => {
      const res = await request
        .put('/api/matches/match-5')
        .send({ status: 'completed' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('completed');
    });

    it('returns 404 for unknown match on PUT', async () => {
      const res = await request.put('/api/matches/nope').send({ homeScore: 1 });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /health', () => {
    it('returns status ok', async () => {
      const res = await request.get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
