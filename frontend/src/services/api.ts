import axios, { AxiosInstance } from 'axios';
import type { Player, Team, Match, ApiResponse } from '@types/index';

const API_URL = 'http://localhost:3001/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============= PLAYERS =============
export const playerService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Player[]>>('/players');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Player>>(`/players/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Player>) => {
    const response = await api.put<ApiResponse<Player>>(`/players/${id}`, data);
    return response.data.data;
  },
};

// ============= TEAMS =============
// TODO: Candidate should implement this following playerService pattern
export const teamService = {
  // getAll: async () => { ... },
  // getById: async (id: string) => { ... },
  // update: async (id: string, data: Partial<Team>) => { ... },
};

// ============= MATCHES =============
// TODO: Candidate should implement this following playerService pattern
export const matchService = {
  // getAll: async () => { ... },
  // getById: async (id: string) => { ... },
  // update: async (id: string, data: Partial<Match>) => { ... },
};
