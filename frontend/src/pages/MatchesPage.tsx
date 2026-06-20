import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMatches, selectMatches, selectMatchesLoading } from '@redux/slices/matchSlice';
import { fetchTeams, selectTeams } from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import type { Team, Match } from '@types/index';
import { Card, CardBody, Badge, Spinner } from '@components/common';

const statusVariant = (status: string) => {
  if (status === 'live') return 'danger';
  if (status === 'completed') return 'success';
  return 'secondary';
};

export const MatchesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const matches = useSelector((state: RootState) => selectMatches(state));
  const teams = useSelector((state: RootState) => selectTeams(state));
  const loading = useSelector((state: RootState) => selectMatchesLoading(state));

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches());
    if (teams.length === 0) dispatch(fetchTeams());
  }, [dispatch, matches.length, teams.length]);

  const teamName = (id: string) =>
    teams.find((t: Team) => t.id === id)?.name ?? id;

  const teamLogo = (id: string) =>
    teams.find((t: Team) => t.id === id)?.logo;

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
          {(matches as Match[]).map((match) => (
            <div key={match.id} className="col-md-6 mb-4">
              <Card onClick={() => navigate(`/matches/${match.id}`)}>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Badge variant={statusVariant(match.status)}>
                      {match.status === 'live' ? '🔴 LIVE' : match.status.toUpperCase()}
                    </Badge>
                    <small className="text-muted">
                      {new Date(match.date).toLocaleDateString()}
                    </small>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="text-center flex-fill">
                      {teamLogo(match.homeTeamId) && (
                        <img
                          src={teamLogo(match.homeTeamId)}
                          alt={teamName(match.homeTeamId)}
                          style={{ width: 32, height: 32, objectFit: 'contain', display: 'block', margin: '0 auto 4px' }}
                        />
                      )}
                      <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem' }}>{teamName(match.homeTeamId)}</p>
                      <span className="text-muted small">Home</span>
                    </div>

                    <div className="text-center px-3">
                      <h3 className="mb-0">
                        {match.homeScore} – {match.awayScore}
                      </h3>
                    </div>

                    <div className="text-center flex-fill">
                      {teamLogo(match.awayTeamId) && (
                        <img
                          src={teamLogo(match.awayTeamId)}
                          alt={teamName(match.awayTeamId)}
                          style={{ width: 32, height: 32, objectFit: 'contain', display: 'block', margin: '0 auto 4px' }}
                        />
                      )}
                      <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem' }}>{teamName(match.awayTeamId)}</p>
                      <span className="text-muted small">Away</span>
                    </div>
                  </div>

                  {match.events.length > 0 && (
                    <div className="mt-3 pt-2 border-top d-flex gap-2 flex-wrap">
                      {match.events.map(e => (
                        <span key={e.id} className="small text-muted">
                          {e.type === 'goal' && `⚽ ${e.minute}'`}
                          {e.type === 'yellow_card' && `🟨 ${e.minute}'`}
                          {e.type === 'red_card' && `🟥 ${e.minute}'`}
                          {e.type === 'own_goal' && `⚽(OG) ${e.minute}'`}
                          {e.type === 'penalty' && `⚽(P) ${e.minute}'`}
                        </span>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
