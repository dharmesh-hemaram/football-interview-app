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
          <h1>Premier League Clubs</h1>
          <p className="text-muted">Select a team to view squad and fixtures</p>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="alert alert-info">No teams found.</div>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team.id} className="col-md-6 col-lg-3 mb-4">
              <Card onClick={() => navigate(`/teams/${team.id}`)} className="h-100 text-center">
                <CardBody>
                  {team.logo && (
                    <img
                      src={team.logo}
                      alt={team.name}
                      style={{ width: 72, height: 72, objectFit: 'contain' }}
                      className="mb-3"
                    />
                  )}
                  <h5 className="card-title mb-1">{team.name}</h5>
                  <p className="text-muted small mb-2">{team.stadium}</p>
                  <p className="text-muted small mb-3">Est. {team.founded} · {team.country}</p>
                  <div className="d-flex justify-content-center gap-2 mb-2">
                    <Badge variant="success">W {team.wins}</Badge>
                    <Badge variant="danger">L {team.losses}</Badge>
                    <Badge variant="secondary">D {team.draws}</Badge>
                  </div>
                  <small className="text-muted">
                    GD: <strong>{team.goalsDifference > 0 ? '+' : ''}{team.goalsDifference}</strong>
                    &nbsp;·&nbsp;
                    Pts: <strong>{team.wins * 3 + team.draws}</strong>
                  </small>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
