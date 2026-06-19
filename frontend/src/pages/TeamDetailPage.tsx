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

const positionOrder: Record<string, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const team = useSelector((state: RootState) => selectSelectedTeam(state));
  const loading = useSelector((state: RootState) => selectTeamsLoading(state));
  const allTeams = useSelector((state: RootState) => selectTeams(state));
  const players = useSelector((state: RootState) => selectPlayersByTeam(state, id ?? ''));
  const matches = useSelector((state: RootState) => selectMatchesByTeam(state, id ?? ''));

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

  if (loading) return <Spinner text="Loading team..." />;

  if (!team) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Team not found</div>
        <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
      </div>
    );
  }

  const teamName = (teamId: string) => {
    const t = allTeams.find((t: Team) => t.id === teamId);
    return t?.shortName ?? t?.name ?? teamId;
  };

  const teamLogo = (teamId: string) =>
    allTeams.find((t: Team) => t.id === teamId)?.logo;

  const sortedPlayers = [...players].sort(
    (a: Player, b: Player) => positionOrder[a.position] - positionOrder[b.position]
  );

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

  const points = team.wins * 3 + team.draws;

  return (
    <div className="container mt-5">
      <Button onClick={() => navigate('/teams')} variant="secondary" className="mb-3">
        ← Back to Teams
      </Button>

      {/* ── Team Header ──────────────────────────────────────────── */}
      <div className="row mb-4">
        <div className="col-lg-10">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="d-flex align-items-center gap-4">
                  {team.logo && (
                    <img
                      src={team.logo}
                      alt={team.name}
                      style={{ width: 80, height: 80, objectFit: 'contain' }}
                    />
                  )}
                  <div>
                    <h2 className="mb-1">{team.name}</h2>
                    <p className="text-muted mb-1">
                      🏟 {team.stadium} &nbsp;·&nbsp; 📅 Est. {team.founded} &nbsp;·&nbsp; 🏴󠁧󠁢󠁥󠁮󠁧󠁿 {team.country}
                    </p>
                    <p className="mb-0">
                      <strong>{points} pts</strong>
                      <span className="text-muted ms-2">({team.wins}W · {team.draws}D · {team.losses}L)</span>
                    </p>
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
                      <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stadium</label>
                      <input type="text" className="form-control" name="stadium" value={(formData as any).stadium || ''} onChange={handleInputChange} />
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
                  <div className="col-md-3 mb-2">
                    <div className="bg-success bg-opacity-10 p-3 rounded text-center">
                      <h3 className="mb-0">{team.wins}</h3>
                      <small className="text-muted">Wins</small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="bg-danger bg-opacity-10 p-3 rounded text-center">
                      <h3 className="mb-0">{team.losses}</h3>
                      <small className="text-muted">Losses</small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="bg-secondary bg-opacity-10 p-3 rounded text-center">
                      <h3 className="mb-0">{team.draws}</h3>
                      <small className="text-muted">Draws</small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="bg-primary bg-opacity-10 p-3 rounded text-center">
                      <h3 className="mb-0">{team.goalsDifference > 0 ? '+' : ''}{team.goalsDifference}</h3>
                      <small className="text-muted">Goal Diff.</small>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ── Squad ────────────────────────────────────────────────── */}
      <div className="mb-5">
        <h4 className="mb-3">
          Squad <Badge variant="secondary">{sortedPlayers.length}</Badge>
        </h4>
        {sortedPlayers.length === 0 ? (
          <div className="alert alert-info">No players found for this team.</div>
        ) : (
          <div className="row">
            {sortedPlayers.map((player: Player) => (
              <div key={player.id} className="col-md-6 col-lg-3 mb-3">
                <Card onClick={() => navigate(`/players/${player.id}`)} className="h-100">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge variant={positionColor[player.position] as any}>
                        {player.position}
                      </Badge>
                      <span className="text-muted small">#{player.jerseyNumber}</span>
                    </div>
                    <h6 className="mb-0">{player.name}</h6>
                    <small className="text-muted">{player.nationality}</small>
                    <div className="d-flex gap-3 mt-2 mb-2">
                      <div className="text-center">
                        <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Goals</small>
                        <strong>{player.goals}</strong>
                      </div>
                      <div className="text-center">
                        <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Assists</small>
                        <strong>{player.assists}</strong>
                      </div>
                      <div className="text-center">
                        <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Apps</small>
                        <strong>{player.matches}</strong>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {player.yellowCards > 0 && (
                        <span style={{ fontSize: '0.75rem' }}>🟨 {player.yellowCards}</span>
                      )}
                      {player.redCards > 0 && (
                        <span style={{ fontSize: '0.75rem' }}>🟥 {player.redCards}</span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Matches ──────────────────────────────────────────────── */}
      <div className="mb-4">
        <h4 className="mb-3">
          Fixtures <Badge variant="secondary">{matches.length}</Badge>
        </h4>
        {matches.length === 0 ? (
          <div className="alert alert-info">No matches found for this team.</div>
        ) : (
          <div className="row">
            {(matches as Match[]).map((match) => (
              <div key={match.id} className="col-md-6 mb-3">
                <Card onClick={() => navigate(`/matches/${match.id}`)} className="h-100">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge variant={statusVariant(match.status)}>
                        {match.status === 'live' ? '🔴 LIVE' : match.status.toUpperCase()}
                      </Badge>
                      <small className="text-muted">{new Date(match.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-center flex-fill">
                        {teamLogo(match.homeTeamId) && (
                          <img src={teamLogo(match.homeTeamId)} alt="" style={{ width: 28, height: 28, objectFit: 'contain', display: 'block', margin: '0 auto 4px' }} />
                        )}
                        <p className="fw-semibold mb-0 small">
                          {match.homeTeamId === id ? <strong>{teamName(match.homeTeamId)}</strong> : teamName(match.homeTeamId)}
                        </p>
                      </div>
                      <div className="text-center px-2">
                        <h5 className="mb-0">{match.homeScore} – {match.awayScore}</h5>
                      </div>
                      <div className="text-center flex-fill">
                        {teamLogo(match.awayTeamId) && (
                          <img src={teamLogo(match.awayTeamId)} alt="" style={{ width: 28, height: 28, objectFit: 'contain', display: 'block', margin: '0 auto 4px' }} />
                        )}
                        <p className="fw-semibold mb-0 small">
                          {match.awayTeamId === id ? <strong>{teamName(match.awayTeamId)}</strong> : teamName(match.awayTeamId)}
                        </p>
                      </div>
                    </div>
                    {match.events.filter(e => e.teamId === id).length > 0 && (
                      <div className="mt-2 pt-2 border-top d-flex gap-2 flex-wrap">
                        {match.events.filter(e => e.teamId === id).map(e => (
                          <span key={e.id} className="small text-muted">
                            {(e.type === 'goal' || e.type === 'penalty') && `⚽ ${e.minute}'`}
                            {e.type === 'own_goal' && `⚽(OG) ${e.minute}'`}
                            {e.type === 'yellow_card' && `🟨 ${e.minute}'`}
                            {e.type === 'red_card' && `🟥 ${e.minute}'`}
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
    </div>
  );
};
