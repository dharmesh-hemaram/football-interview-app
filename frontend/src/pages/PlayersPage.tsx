import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPlayers, selectPlayers, selectPlayersLoading } from '@redux/slices/playerSlice';
import { fetchTeams, selectTeams } from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import type { Team } from '@types/index';
import { Card, CardBody, Spinner, Badge } from '@components/common';

const positionColor: Record<string, string> = {
  GK: 'warning',
  DEF: 'info',
  MID: 'primary',
  FWD: 'danger',
};

export const PlayersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const players = useSelector((state: RootState) => selectPlayers(state));
  const teams = useSelector((state: RootState) => selectTeams(state));
  const loading = useSelector((state: RootState) => selectPlayersLoading(state));

  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchTeams());
  }, [dispatch]);

  if (loading) {
    return <Spinner text="Loading players..." />;
  }

  const teamName = (teamId: string) =>
    teams.find((t: Team) => t.id === teamId)?.name ?? teamId;

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h1>All Players</h1>
          <p className="text-muted">Browse all players across all teams</p>
        </div>
      </div>

      <div className="row">
        {players.map((player) => (
          <div key={player.id} className="col-md-6 col-lg-4 mb-4">
            <Card
              onClick={() => navigate(`/players/${player.id}`)}
              className="h-100"
            >
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <Badge variant={positionColor[player.position] as any} className="me-2">
                      {player.position}
                    </Badge>
                    <Badge variant="secondary">#{player.jerseyNumber}</Badge>
                  </div>
                </div>
                <h5 className="card-title mb-1">{player.name}</h5>
                <p className="text-muted small mb-1">{teamName(player.teamId)}</p>
                <p className="text-muted small mb-3">{player.nationality}</p>
                <div className="row text-center mb-3">
                  <div className="col-4">
                    <small className="text-muted d-block">Goals</small>
                    <strong>{player.goals}</strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block">Assists</small>
                    <strong>{player.assists}</strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block">Apps</small>
                    <strong>{player.matches}</strong>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  {player.yellowCards > 0 && (
                    <span className="small text-muted">🟨 {player.yellowCards} yellow</span>
                  )}
                  {player.redCards > 0 && (
                    <span className="small text-muted">🟥 {player.redCards} red</span>
                  )}
                  {player.yellowCards === 0 && player.redCards === 0 && (
                    <span className="small text-muted">No cards</span>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
