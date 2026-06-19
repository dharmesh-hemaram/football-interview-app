import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMatchById, selectSelectedMatch, selectMatchesLoading } from '@redux/slices/matchSlice';
import { fetchPlayers, selectPlayers } from '@redux/slices/playerSlice';
import { fetchTeams, selectTeams } from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import type { MatchEvent, Player, Team } from '@types/index';
import { Card, CardBody, Badge, Button, Spinner } from '@components/common';

const statusVariant = (status: string) => {
  if (status === 'live') return 'danger';
  if (status === 'completed') return 'success';
  return 'secondary';
};

const eventIcon = (type: MatchEvent['type']) => {
  switch (type) {
    case 'goal': return '⚽';
    case 'yellow_card': return '🟨';
    case 'red_card': return '🟥';
    case 'own_goal': return '⚽';
    case 'penalty': return '⚽';
    default: return '•';
  }
};

const eventLabel = (type: MatchEvent['type']) => {
  switch (type) {
    case 'goal': return 'Goal';
    case 'yellow_card': return 'Yellow Card';
    case 'red_card': return 'Red Card';
    case 'own_goal': return 'Own Goal';
    case 'penalty': return 'Penalty';
    default: return type;
  }
};

export const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const match = useSelector((state: RootState) => selectSelectedMatch(state));
  const loading = useSelector((state: RootState) => selectMatchesLoading(state));
  const players = useSelector((state: RootState) => selectPlayers(state));
  const teams = useSelector((state: RootState) => selectTeams(state));

  useEffect(() => {
    if (id) {
      dispatch(fetchMatchById(id));
      dispatch(fetchPlayers());
      dispatch(fetchTeams());
    }
  }, [id, dispatch]);

  if (loading) return <Spinner text="Loading match..." />;

  if (!match) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Match not found</div>
        <Button onClick={() => navigate('/matches')}>Back to Matches</Button>
      </div>
    );
  }

  const homeTeam = teams.find((t: Team) => t.id === match.homeTeamId);
  const awayTeam = teams.find((t: Team) => t.id === match.awayTeamId);
  const playerName = (playerId: string) =>
    players.find((p: Player) => p.id === playerId)?.name ?? 'Unknown';

  const homeEvents = match.events.filter((e: MatchEvent) => e.teamId === match.homeTeamId);
  const awayEvents = match.events.filter((e: MatchEvent) => e.teamId === match.awayTeamId);
  const allEvents = [...match.events].sort((a, b) => a.minute - b.minute);

  return (
    <div className="container mt-5">
      <Button onClick={() => navigate('/matches')} variant="secondary" className="mb-3">
        ← Back to Matches
      </Button>

      {/* Match Header */}
      <Card className="mb-4">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Badge variant={statusVariant(match.status)}>
              {match.status === 'live' ? '🔴 LIVE' : match.status.toUpperCase()}
            </Badge>
            <small className="text-muted">{new Date(match.date).toLocaleString()}</small>
          </div>

          <div className="row align-items-center text-center">
            {/* Home Team */}
            <div className="col-5">
              {homeTeam?.logo && (
                <img
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  style={{ width: 56, height: 56, objectFit: 'contain' }}
                  className="mb-2"
                />
              )}
              <h4
                className="mb-0"
                style={{ cursor: 'pointer', color: '#0d6efd' }}
                onClick={() => navigate(`/teams/${match.homeTeamId}`)}
              >
                {homeTeam?.name ?? match.homeTeamId}
              </h4>
              <small className="text-muted">Home</small>
            </div>

            {/* Score */}
            <div className="col-2">
              <div className="display-4 fw-bold">
                {match.homeScore} – {match.awayScore}
              </div>
              {match.status === 'live' && <small className="text-danger fw-bold">IN PROGRESS</small>}
            </div>

            {/* Away Team */}
            <div className="col-5">
              {awayTeam?.logo && (
                <img
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  style={{ width: 56, height: 56, objectFit: 'contain' }}
                  className="mb-2"
                />
              )}
              <h4
                className="mb-0"
                style={{ cursor: 'pointer', color: '#0d6efd' }}
                onClick={() => navigate(`/teams/${match.awayTeamId}`)}
              >
                {awayTeam?.name ?? match.awayTeamId}
              </h4>
              <small className="text-muted">Away</small>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Match Events Timeline */}
      {allEvents.length > 0 ? (
        <Card className="mb-4">
          <CardBody>
            <h5 className="mb-3">Match Events</h5>
            <div className="position-relative">
              {allEvents.map((event: MatchEvent) => {
                const isHome = event.teamId === match.homeTeamId;
                return (
                  <div
                    key={event.id}
                    className={`d-flex align-items-center mb-3 ${isHome ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Team side content */}
                    <div className={`flex-fill ${isHome ? 'text-start pe-3' : 'text-end ps-3'}`}>
                      <span className="fw-semibold" style={{ cursor: 'pointer', color: '#0d6efd' }}
                        onClick={() => navigate(`/players/${event.playerId}`)}>
                        {playerName(event.playerId)}
                      </span>
                      <span className="text-muted ms-1 small">{eventLabel(event.type)}</span>
                    </div>

                    {/* Center — minute + icon */}
                    <div className="text-center" style={{ minWidth: 80 }}>
                      <span className="badge bg-light text-dark border">
                        {eventIcon(event.type)} {event.minute}'
                      </span>
                    </div>

                    {/* Opposite side placeholder */}
                    <div className="flex-fill" />
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      ) : (
        match.status !== 'scheduled' && (
          <div className="alert alert-info">No events recorded for this match.</div>
        )
      )}

      {/* Per-team event summary */}
      {(homeEvents.length > 0 || awayEvents.length > 0) && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <Card>
              <CardBody>
                <h6 className="mb-3">{homeTeam?.name} Events</h6>
                {homeEvents.length === 0 ? (
                  <p className="text-muted small">No events</p>
                ) : (
                  homeEvents.map((e: MatchEvent) => (
                    <div key={e.id} className="d-flex align-items-center gap-2 mb-2">
                      <span>{eventIcon(e.type)}</span>
                      <span className="small">
                        <span className="fw-semibold">{e.minute}'</span>{' '}
                        <span
                          style={{ cursor: 'pointer', color: '#0d6efd' }}
                          onClick={() => navigate(`/players/${e.playerId}`)}
                        >
                          {playerName(e.playerId)}
                        </span>{' '}
                        <span className="text-muted">({eventLabel(e.type)})</span>
                      </span>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </div>
          <div className="col-md-6 mb-3">
            <Card>
              <CardBody>
                <h6 className="mb-3">{awayTeam?.name} Events</h6>
                {awayEvents.length === 0 ? (
                  <p className="text-muted small">No events</p>
                ) : (
                  awayEvents.map((e: MatchEvent) => (
                    <div key={e.id} className="d-flex align-items-center gap-2 mb-2">
                      <span>{eventIcon(e.type)}</span>
                      <span className="small">
                        <span className="fw-semibold">{e.minute}'</span>{' '}
                        <span
                          style={{ cursor: 'pointer', color: '#0d6efd' }}
                          onClick={() => navigate(`/players/${e.playerId}`)}
                        >
                          {playerName(e.playerId)}
                        </span>{' '}
                        <span className="text-muted">({eventLabel(e.type)})</span>
                      </span>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
