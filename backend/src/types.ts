// Shared types between backend and frontend
export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  teamId: string;
  goals: number;
  assists: number;
  matches: number;
  jerseyNumber: number;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  country: string;
  founded: number;
  wins: number;
  losses: number;
  draws: number;
  goalsDifference: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  status: 'scheduled' | 'live' | 'completed';
  homeScore: number;
  awayScore: number;
}

export interface Notification {
  id: string;
  type: 'match_update' | 'goal' | 'red_card' | 'injury';
  title: string;
  message: string;
  timestamp: number;
  matchId: string;
  read: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
