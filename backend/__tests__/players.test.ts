import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../src/app';

describe('Players API', () => {
  let request: ReturnType<typeof supertest>;

  beforeEach(() => {
    const { app } = createApp();
    request = supertest(app);
  });

  describe('GET /api/players', () => {
    it('returns 200 with success flag', async () => {
      const res = await request.get('/api/players');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns all 32 players (8 per team × 4 teams)', async () => {
      const res = await request.get('/api/players');
      expect(res.body.data).toHaveLength(32);
    });

    it('returns players with correct shape including cards', async () => {
      const res = await request.get('/api/players');
      const player = res.body.data[0];
      expect(player).toHaveProperty('id');
      expect(player).toHaveProperty('name');
      expect(player).toHaveProperty('position');
      expect(player).toHaveProperty('teamId');
      expect(player).toHaveProperty('nationality');
      expect(player).toHaveProperty('goals');
      expect(player).toHaveProperty('assists');
      expect(player).toHaveProperty('matches');
      expect(player).toHaveProperty('jerseyNumber');
      expect(player).toHaveProperty('yellowCards');
      expect(player).toHaveProperty('redCards');
    });

    it('has 8 players per team', async () => {
      const res = await request.get('/api/players');
      const teamCounts: Record<string, number> = {};
      res.body.data.forEach((p: any) => {
        teamCounts[p.teamId] = (teamCounts[p.teamId] ?? 0) + 1;
      });
      Object.values(teamCounts).forEach((count) => expect(count).toBe(8));
    });

    it('all positions are valid values', async () => {
      const res = await request.get('/api/players');
      const validPositions = ['GK', 'DEF', 'MID', 'FWD'];
      res.body.data.forEach((p: any) => {
        expect(validPositions).toContain(p.position);
      });
    });

    it('Salah has highest goals (28)', async () => {
      const res = await request.get('/api/players');
      const salah = res.body.data.find((p: any) => p.name === 'Mohamed Salah');
      expect(salah).toBeDefined();
      expect(salah.goals).toBe(28);
      expect(salah.assists).toBe(17);
    });
  });

  describe('GET /api/players/:id', () => {
    it('returns Bukayo Saka by id', async () => {
      const res = await request.get('/api/players/player-a6');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Bukayo Saka');
      expect(res.body.data.jerseyNumber).toBe(7);
      expect(res.body.data.nationality).toBe('England');
    });

    it('returns 404 for unknown player', async () => {
      const res = await request.get('/api/players/player-xyz');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/players/:id', () => {
    it('updates goals and preserves other fields', async () => {
      const res = await request
        .put('/api/players/player-l6')
        .send({ goals: 35 });
      expect(res.status).toBe(200);
      expect(res.body.data.goals).toBe(35);
      expect(res.body.data.name).toBe('Mohamed Salah'); // unchanged
    });

    it('can update yellowCards and redCards', async () => {
      const res = await request
        .put('/api/players/player-t2')
        .send({ yellowCards: 10, redCards: 3 });
      expect(res.status).toBe(200);
      expect(res.body.data.yellowCards).toBe(10);
      expect(res.body.data.redCards).toBe(3);
    });

    it('returns 404 for unknown player on PUT', async () => {
      const res = await request.put('/api/players/nope').send({ goals: 1 });
      expect(res.status).toBe(404);
    });
  });
});
