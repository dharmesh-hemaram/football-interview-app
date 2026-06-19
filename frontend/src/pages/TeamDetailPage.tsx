import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchTeamById,
  fetchTeams,
  selectSelectedTeam,
  selectTeams,
  selectTeamsLoading,
  updateTeam,
} from '@redux/slices/teamSlice';
import { fetchPlayers, selectPlayersByTeam } from '@redux/slices/playerSlice';
import { fetchMatches, selectMatchesByTeam } from '@redux/slices/matchSlice';
import type { RootState, AppDispatch } from '@redux/store';
import type { Team, Player, Match } from '@types/index';
import { Card, CardBody, Button, Badge, Spinner } from '@components/common';

const statusVariant = (status: string) => {
  if (status === 'live') return 'danger';
  if (status === 'completed') return 'success';
  return 'secondary';
};

const positionColor: Record<string, string> = {
  GK: 'warning',
  DEF: 'info',
  MID: 'primary',
  FWD: 'danger',
};

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const team = useSelector((state: RootState) => selectSelectedTeam(state));
  const loading = useSelector((state: RootState) => selectTeamsLoading(state));
  const players = useSelector((state: RootState) => selectPlayersByTeam(state, id ?? ''));
  const matches = useSelector((state: RootState) => selectMatchesByTeam(state, id ?? ''));
  const allTeams = useSelector((state: RootState) => selectTeams(state));

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Team> | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeamById(id));
      dispatch(fetchTeams());
      dispatch(fetchPlayers());
      dispatch(fetchMatches());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (team && !formData) {
      setFormData(team);
    }
  }, [team, formData]);

  if (loading) {
    return <Spinner text="Loading team..." />;
  }

  if (!team) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Team not found</div>
        <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
      </div>
    );
  }

  const teamName = (teamId: string) =>
    allTeams.find((t: Team) => t.id === teamId)?.name ?? teamId;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
  };

  const handleSave = async () => {
    if (id && formData) {
      await dispatch(updateTeam({ id, data: formData }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(team);
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <Button onClick={() => navigate('/teams')} variant="secondary" className="mb-3">
        ← Back to Teams
      </Button>

      {/* Team Header */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                  {team.logo && (
                    <img
                      src={team.logo}
                      alt={team.name}
                      style={{ width: 56, height: 56, objectFit: 'contain' }}
                    />
                  )}
                  <div>
                    <h2 className="mb-0">{team.name}</h2>
                    <span className="text-muted">{team.country} · Est. {team.founded}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'secondary' : 'primary'}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {isEditing && formData ? (
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Wins</label>
                      <input type="number" className="form-control" name="wins" value={formData.wins ?? 0} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Losses</label>
                      <input type="number" className="form-control" name="losses" value={formData.losses ?? 0} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Draws</label>
                      <input type="number" className="form-control" name="draws" value={formData.draws ?? 0} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Goals Difference</label>
                      <input type="number" className="form-control" name="goalsDifference" value={formData.goalsDifference ?? 0} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Founded</label>
                      <input type="number" className="form-control" name="founded" value={formData.founded ?? 0} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button onClick={handleSave} variant="success">Save Changes</Button>
                    <Button onClick={handleCancel} variant="secondary">Cancel</Button>
                  </div>
                </form>
              ) : (
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="bg-success bg-opacity-10 p-3 rounded text-center">
                      <h3>{team.wins}</h3>
                      <p className="text-muted mb-0">Wins</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="bg-danger bg-opacity-10 p-3 rounded text-center">
                      <h3>{team.losses}</h3>
                      <p className="text-muted mb-0">Losses</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="bg-secondary bg-opacity-10 p-3 rounded text-center">
                      <h3>{team.draws}</h3>
                      <p className="text-muted mb-0">Draws</p>
                    </div>
                  </div>
                  <div className="col-12">
                    <p className="text-muted mb-0">Goals Difference: <strong>{team.goalsDifference > 0 ? '+' : ''}{team.goalsDifference}</strong></p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Squad */}
      <div className="mb-4">
        <h4 className="mb-3">Squad <span className="badge bg-secondary">{players.length}</span></h4>
        {players.length === 0 ? (
          <div className="alert alert-info">No players found for this team.</div>
        ) : (
          <div className="row">
            {players.map((player: Player) => (
              <div key={player.id} className="col-md-6 col-lg-3 mb-3">
                <Card onClick={() => navigate(`/players/${player.id}`)} className="h-100">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Badge variant={positionColor[player.position] as any} className="me-1">
                          {player.position}
                        </Badge>
                        <Badge variant="secondary">#{player.jerseyNumber}</Badge>
                      </div>
                    </div>
                    <h6 className="mb-2">{player.name}</h6>
                    <div className="d-flex gap-3 mb-2">
                      <div className="text-center">
                        <small className="text-muted d-block">Goals</small>
                        <strong>{player.goals}</strong>
                      </div>
                      <div className="text-center">
                        <small className="text-muted d-block">Assists</small>
                        <strong>{player.assists}</strong>
                      </div>
                      <div className="text-center">
                        <small className="text-muted d-block">Apps</small>
                        <strong>{player.matches}</strong>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {player.yellowCards > 0 && (
                        <span title="Yellow Cards" style={{ fontSize: '0.75rem' }}>
                          🟨 {player.yellowCards}
                        </span>
                      )}
                      {player.redCards > 0 && (
                        <span title="Red Cards" style={{ fontSize: '0.75rem' }}>
                          🟥 {player.redCards}
                        </span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Matches */}
      <div className="mb-4">
        <h4 className="mb-3">Matches <span className="badge bg-secondary">{matches.length}</span></h4>
        {matches.length === 0 ? (
          <div className="alert alert-info">No matches found for this team.</div>
        ) : (
          <div className="row">
            {matches.map((match: Match) => (
              <div key={match.id} className="col-md-6 mb-3">
                <Card onClick={() => navigate(`/matches/${match.id}`)} className="h-100">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge variant={statusVariant(match.status)}>
                        {match.status === 'live' ? '🔴 LIVE' : match.status.toUpperCase()}
                      </Badge>
                      <small className="text-muted">{new Date(match.date).toLocaleDateString()}</small>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-center flex-fill">
                        <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem' }}>
                          {match.homeTeamId === id ? (
                            <strong>{teamName(match.homeTeamId)}</strong>
                          ) : teamName(match.homeTeamId)}
                        </p>
                        <small className="text-muted">Home</small>
                      </div>
                      <div className="text-center px-3">
                        <h4 className="mb-0">{match.homeScore} – {match.awayScore}</h4>
                      </div>
                      <div className="text-center flex-fill">
                        <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem' }}>
                          {match.awayTeamId === id ? (
                            <strong>{teamName(match.awayTeamId)}</strong>
                          ) : teamName(match.awayTeamId)}
                        </p>
                        <small className="text-muted">Away</small>
                      </div>
                    </div>
                    {match.events.length > 0 && (
                      <div className="mt-2 pt-2 border-top">
                        <small className="text-muted d-flex gap-2 flex-wrap">
                          {match.events.filter(e => e.teamId === id).map(e => (
                            <span key={e.id}>
                              {e.type === 'goal' && `⚽ ${e.minute}'`}
                              {e.type === 'yellow_card' && `🟨 ${e.minute}'`}
                              {e.type === 'red_card' && `🟥 ${e.minute}'`}
                              {e.type === 'own_goal' && `⚽(OG) ${e.minute}'`}
                              {e.type === 'penalty' && `⚽(P) ${e.minute}'`}
                            </span>
                          ))}
                        </small>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
