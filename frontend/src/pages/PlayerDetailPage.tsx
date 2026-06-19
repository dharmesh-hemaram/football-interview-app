import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchPlayerById,
  selectSelectedPlayer,
  selectPlayersLoading,
  updatePlayer,
} from '@redux/slices/playerSlice';
import { fetchTeams, selectTeams } from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import type { Player, Team } from '@types/index';
import { Card, CardBody, Button, Badge, Spinner } from '@components/common';

const positionColor: Record<string, string> = {
  GK: 'warning',
  DEF: 'info',
  MID: 'primary',
  FWD: 'danger',
};

export const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const player = useSelector((state: RootState) => selectSelectedPlayer(state));
  const teams = useSelector((state: RootState) => selectTeams(state));
  const loading = useSelector((state: RootState) => selectPlayersLoading(state));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Player> | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchPlayerById(id));
      dispatch(fetchTeams());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (player && !formData) {
      setFormData(player);
    }
  }, [player, formData]);

  if (loading) {
    return <Spinner text="Loading player..." />;
  }

  if (!player) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Player not found</div>
        <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
      </div>
    );
  }

  const playerTeam = teams.find((t: Team) => t.id === player.teamId);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    if (id && formData) {
      await dispatch(updatePlayer({ id, data: formData }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(player);
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex gap-2 mb-3">
        <Button onClick={() => navigate(`/teams/${player.teamId}`)} variant="secondary">
          ← Back to {playerTeam?.name ?? 'Team'}
        </Button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="mb-1">{player.name}</h2>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <Badge variant={positionColor[player.position] as any}>
                      {player.position}
                    </Badge>
                    <Badge variant="secondary">#{player.jerseyNumber}</Badge>
                    {player.nationality && (
                      <span className="text-muted small">{player.nationality}</span>
                    )}
                    {playerTeam && (
                      <span
                        className="text-muted small"
                        style={{ cursor: 'pointer', color: '#0d6efd' }}
                        onClick={() => navigate(`/teams/${player.teamId}`)}
                      >
                        {playerTeam.logo && (
                          <img
                            src={playerTeam.logo}
                            alt={playerTeam.name}
                            style={{ width: 20, height: 20, objectFit: 'contain', marginRight: 4 }}
                          />
                        )}
                        {playerTeam.name}
                      </span>
                    )}
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
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Position</label>
                    <select
                      className="form-select"
                      name="position"
                      value={formData.position || ''}
                      onChange={handleInputChange}
                    >
                      <option value="GK">Goalkeeper</option>
                      <option value="DEF">Defender</option>
                      <option value="MID">Midfielder</option>
                      <option value="FWD">Forward</option>
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Goals</label>
                      <input type="number" className="form-control" name="goals" value={formData.goals || 0} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Assists</label>
                      <input type="number" className="form-control" name="assists" value={formData.assists || 0} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Appearances</label>
                      <input type="number" className="form-control" name="matches" value={formData.matches || 0} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Yellow Cards</label>
                      <input type="number" className="form-control" name="yellowCards" value={formData.yellowCards || 0} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Red Cards</label>
                      <input type="number" className="form-control" name="redCards" value={formData.redCards || 0} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Jersey Number</label>
                    <input type="number" className="form-control" name="jerseyNumber" value={formData.jerseyNumber || 0} onChange={handleInputChange} />
                  </div>

                  <div className="d-flex gap-2">
                    <Button onClick={handleSave} variant="success">Save Changes</Button>
                    <Button onClick={handleCancel} variant="secondary">Cancel</Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                      <div className="bg-light p-3 rounded text-center">
                        <h3>{player.goals}</h3>
                        <p className="text-muted mb-0">Goals</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="bg-light p-3 rounded text-center">
                        <h3>{player.assists}</h3>
                        <p className="text-muted mb-0">Assists</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="bg-light p-3 rounded text-center">
                        <h3>{player.matches}</h3>
                        <p className="text-muted mb-0">Apps</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div
                        className="p-3 rounded text-center"
                        style={{ background: player.redCards > 0 ? '#ffe0e0' : '#fff3cd' }}
                      >
                        <h3 className="mb-0">
                          {player.yellowCards > 0 && <span>🟨{player.yellowCards}</span>}
                          {player.redCards > 0 && <span className="ms-1">🟥{player.redCards}</span>}
                          {player.yellowCards === 0 && player.redCards === 0 && '—'}
                        </h3>
                        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Cards</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
