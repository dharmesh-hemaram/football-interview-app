import axios, { AxiosInstance } from 'axios';
import type { Player, Team, Match, ApiResponse } from '@types/index';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

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
export const teamService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Team[]>>('/teams');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Team>) => {
    const response = await api.put<ApiResponse<Team>>(`/teams/${id}`, data);
    return response.data.data;
  },
};

// ============= MATCHES =============
export const matchService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Match[]>>('/matches');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Match>>(`/matches/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Match>) => {
    const response = await api.put<ApiResponse<Match>>(`/matches/${id}`, data);
    return response.data.data;
  },
};
