import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTeams, selectTeams, selectTeamsLoading } from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import { Card, CardBody, Badge, Spinner } from '@components/common';

export const TeamsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const teams = useSelector((state: RootState) => selectTeams(state));
  const loading = useSelector((state: RootState) => selectTeamsLoading(state));

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  if (loading) {
    return <Spinner text="Loading teams..." />;
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h1>Teams</h1>
          <p className="text-muted">Explore all football teams</p>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="alert alert-info">No teams found.</div>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team.id} className="col-md-6 col-lg-4 mb-4">
              <Card onClick={() => navigate(`/teams/${team.id}`)} className="h-100">
                <CardBody>
                  {team.logo && (
                    <img
                      src={team.logo}
                      alt={team.name}
                      style={{ width: 48, height: 48, objectFit: 'contain' }}
                      className="mb-2"
                    />
                  )}
                  <h5 className="card-title">{team.name}</h5>
                  <p className="text-muted mb-2">{team.country} · Est. {team.founded}</p>
                  <div className="d-flex gap-2">
                    <Badge variant="success">W {team.wins}</Badge>
                    <Badge variant="danger">L {team.losses}</Badge>
                    <Badge variant="secondary">D {team.draws}</Badge>
                  </div>
                  <small className="text-muted d-block mt-2">GD: {team.goalsDifference}</small>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
