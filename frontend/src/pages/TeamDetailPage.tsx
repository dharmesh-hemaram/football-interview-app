import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
// TODO: Import required actions and selectors from teamSlice
// import { fetchTeamById, selectSelectedTeam, selectTeamsLoading, updateTeam } from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import { Card, CardBody, Button } from '@components/common';

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // TODO: Implement Redux selectors
  // const team = useSelector((state: RootState) => selectSelectedTeam(state));
  // const loading = useSelector((state: RootState) => selectTeamsLoading(state));

  const [isEditing, setIsEditing] = useState(false);
  const team = null; // TODO: Get from Redux
  const loading = false; // TODO: Get from Redux

  useEffect(() => {
    if (id) {
      // TODO: Dispatch fetchTeamById(id)
    }
  }, [id, dispatch]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!team) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Team not found</div>
        <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <Button onClick={() => navigate('/teams')} variant="secondary" className="mb-3">
        ← Back to Teams
      </Button>

      <div className="row">
        <div className="col-lg-8">
          <Card>
            <CardBody>
              <h2>{/* team.name */}</h2>
              {/* TODO: Display team details and stats */}
              {/* TODO: Add edit functionality following PlayerDetailPage pattern */}
              {/* TODO: Display team players from the database */}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
