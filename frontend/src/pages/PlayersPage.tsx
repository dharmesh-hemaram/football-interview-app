import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPlayers, selectPlayers, selectPlayersLoading } from '@redux/slices/playerSlice';
import type { RootState, AppDispatch } from '@redux/store';
import { Card, CardBody, Spinner, Badge } from '@components/common';

export const PlayersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const players = useSelector((state: RootState) => selectPlayers(state));
  const loading = useSelector((state: RootState) => selectPlayersLoading(state));

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  if (loading) {
    return <Spinner text="Loading players..." />;
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h1>Players</h1>
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
                <h5 className="card-title">{player.name}</h5>
                <div className="mb-3">
                  <Badge variant="info" className="me-2">
                    {player.position}
                  </Badge>
                  <Badge variant="secondary">#{player.jerseyNumber}</Badge>
                </div>
                <div className="row mb-2">
                  <div className="col-4">
                    <small className="text-muted">Goals</small>
                    <p className="h6 mb-0">{player.goals}</p>
                  </div>
                  <div className="col-4">
                    <small className="text-muted">Assists</small>
                    <p className="h6 mb-0">{player.assists}</p>
                  </div>
                  <div className="col-4">
                    <small className="text-muted">Matches</small>
                    <p className="h6 mb-0">{player.matches}</p>
                  </div>
                </div>
                <small className="text-muted">Click to view details</small>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
