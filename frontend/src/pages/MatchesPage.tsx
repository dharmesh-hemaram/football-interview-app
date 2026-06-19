import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches, selectMatches, selectMatchesLoading } from '@redux/slices/matchSlice';
import { fetchTeams, selectTeams } from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import type { Team } from '@types/index';
import { Card, CardBody, Badge, Spinner } from '@components/common';

const statusVariant = (status: string) => {
  if (status === 'live') return 'danger';
  if (status === 'completed') return 'success';
  return 'secondary';
};

export const MatchesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const matches = useSelector((state: RootState) => selectMatches(state));
  const teams = useSelector((state: RootState) => selectTeams(state));
  const loading = useSelector((state: RootState) => selectMatchesLoading(state));

  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchTeams());
  }, [dispatch]);

  const teamName = (id: string) =>
    teams.find((t: Team) => t.id === id)?.name ?? id;

  if (loading) {
    return <Spinner text="Loading matches..." />;
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h1>Matches</h1>
          <p className="text-muted">View all scheduled and completed matches</p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="alert alert-info">No matches found.</div>
      ) : (
        <div className="row">
          {matches.map((match) => (
            <div key={match.id} className="col-md-6 mb-4">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Badge variant={statusVariant(match.status)}>
                      {match.status.toUpperCase()}
                    </Badge>
                    <small className="text-muted">
                      {new Date(match.date).toLocaleDateString()}
                    </small>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="text-center flex-fill">
                      <p className="fw-semibold mb-1">{teamName(match.homeTeamId)}</p>
                      <span className="text-muted small">Home</span>
                    </div>

                    <div className="text-center px-3">
                      <h3 className="mb-0">
                        {match.homeScore} – {match.awayScore}
                      </h3>
                    </div>

                    <div className="text-center flex-fill">
                      <p className="fw-semibold mb-1">{teamName(match.awayTeamId)}</p>
                      <span className="text-muted small">Away</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
