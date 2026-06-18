import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchPlayerById,
  selectSelectedPlayer,
  selectPlayersLoading,
  updatePlayer,
} from '@redux/slices/playerSlice';
import type { RootState, AppDispatch } from '@redux/store';
import type { Player } from '@types/index';
import { Card, CardBody, Button, Spinner } from '@components/common';

export const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const player = useSelector((state: RootState) => selectSelectedPlayer(state));
  const loading = useSelector((state: RootState) => selectPlayersLoading(state));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Player> | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchPlayerById(id));
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
        <Button onClick={() => navigate('/players')}>Back to Players</Button>
      </div>
    );
  }

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
      <Button onClick={() => navigate('/players')} variant="secondary" className="mb-3">
        ← Back to Players
      </Button>

      <div className="row">
        <div className="col-lg-8">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{player.name}</h2>
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
                      <input
                        type="number"
                        className="form-control"
                        name="goals"
                        value={formData.goals || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Assists</label>
                      <input
                        type="number"
                        className="form-control"
                        name="assists"
                        value={formData.assists || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Matches</label>
                      <input
                        type="number"
                        className="form-control"
                        name="matches"
                        value={formData.matches || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Jersey Number</label>
                      <input
                        type="number"
                        className="form-control"
                        name="jerseyNumber"
                        value={formData.jerseyNumber || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Button onClick={handleSave} variant="success">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="secondary">
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <p>
                        <strong>Position:</strong> {player.position}
                      </p>
                      <p>
                        <strong>Jersey Number:</strong> {player.jerseyNumber}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Team ID:</strong> {player.teamId}
                      </p>
                    </div>
                  </div>

                  <div className="row">
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
                        <p className="text-muted mb-0">Matches</p>
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
