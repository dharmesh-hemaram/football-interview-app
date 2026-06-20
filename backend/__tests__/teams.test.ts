import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../src/app';

describe('Teams API', () => {
  let request: ReturnType<typeof supertest>;

  beforeEach(() => {
    const { app } = createApp();
    request = supertest(app);
  });

  describe('GET /api/teams', () => {
    it('returns 200 with success flag', async () => {
      const res = await request.get('/api/teams');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns all 4 teams', async () => {
      const res = await request.get('/api/teams');
      expect(res.body.data).toHaveLength(4);
    });

    it('returns teams with correct shape', async () => {
      const res = await request.get('/api/teams');
      const team = res.body.data[0];
      expect(team).toHaveProperty('id');
      expect(team).toHaveProperty('name');
      expect(team).toHaveProperty('shortName');
      expect(team).toHaveProperty('logo');
      expect(team).toHaveProperty('country');
      expect(team).toHaveProperty('founded');
      expect(team).toHaveProperty('stadium');
      expect(team).toHaveProperty('wins');
      expect(team).toHaveProperty('losses');
      expect(team).toHaveProperty('draws');
      expect(team).toHaveProperty('goalsDifference');
    });

    it('contains Arsenal, Chelsea, Tottenham and Liverpool', async () => {
      const res = await request.get('/api/teams');
      const names = res.body.data.map((t: any) => t.shortName);
      expect(names).toContain('Arsenal');
      expect(names).toContain('Chelsea');
      expect(names).toContain('Spurs');
      expect(names).toContain('Liverpool');
    });
  });

  describe('GET /api/teams/:id', () => {
    it('returns a specific team by id', async () => {
      const res = await request.get('/api/teams/team-ars');
      expect(res.status).toBe(200);
      expect(res.body.data.shortName).toBe('Arsenal');
      expect(res.body.data.stadium).toBe('Emirates Stadium');
    });

    it('returns 404 for unknown team', async () => {
      const res = await request.get('/api/teams/team-unknown');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/not found/i);
    });
  });

  describe('PUT /api/teams/:id', () => {
    it('updates a team field and returns updated data', async () => {
      const res = await request
        .put('/api/teams/team-ars')
        .send({ wins: 30 });
      expect(res.status).toBe(200);
      expect(res.body.data.wins).toBe(30);
      expect(res.body.data.shortName).toBe('Arsenal'); // unchanged fields preserved
    });

    it('update is isolated per app instance', async () => {
      await request.put('/api/teams/team-ars').send({ wins: 99 });
      // Fresh app instance should have original data
      const { app: freshApp } = createApp();
      const freshRes = await supertest(freshApp).get('/api/teams/team-ars');
      expect(freshRes.body.data.wins).toBe(26); // original value
    });

    it('returns 404 for unknown team on PUT', async () => {
      const res = await request.put('/api/teams/team-nope').send({ wins: 1 });
      expect(res.status).toBe(404);
    });
  });
});
