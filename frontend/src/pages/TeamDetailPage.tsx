import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchTeamById,
  selectSelectedTeam,
  selectTeamsLoading,
  updateTeam,
} from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import type { Team } from '@types/index';
import { Card, CardBody, Button, Spinner } from '@components/common';

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const team = useSelector((state: RootState) => selectSelectedTeam(state));
  const loading = useSelector((state: RootState) => selectTeamsLoading(state));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Team> | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeamById(id));
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

      <div className="row">
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
                  <h2 className="mb-0">{team.name}</h2>
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
                      <input
                        type="number"
                        className="form-control"
                        name="wins"
                        value={formData.wins ?? 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Losses</label>
                      <input
                        type="number"
                        className="form-control"
                        name="losses"
                        value={formData.losses ?? 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Draws</label>
                      <input
                        type="number"
                        className="form-control"
                        name="draws"
                        value={formData.draws ?? 0}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Goals Difference</label>
                      <input
                        type="number"
                        className="form-control"
                        name="goalsDifference"
                        value={formData.goalsDifference ?? 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Founded</label>
                      <input
                        type="number"
                        className="form-control"
                        name="founded"
                        value={formData.founded ?? 0}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Button onClick={handleSave} variant="success">Save Changes</Button>
                    <Button onClick={handleCancel} variant="secondary">Cancel</Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <p><strong>Country:</strong> {team.country}</p>
                      <p><strong>Founded:</strong> {team.founded}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Goals Difference:</strong> {team.goalsDifference}</p>
                    </div>
                  </div>

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
