import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// TODO: Import required actions and selectors from teamSlice once implemented
// import { fetchTeams, selectTeams, selectTeamsLoading } from '@redux/slices/teamSlice';
import type { RootState, AppDispatch } from '@redux/store';
import { Card, CardBody, Spinner } from '@components/common';

export const TeamsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // TODO: Implement Redux selectors
  // const teams = useSelector((state: RootState) => selectTeams(state));
  // const loading = useSelector((state: RootState) => selectTeamsLoading(state));

  // TODO: Fetch teams on mount
  // useEffect(() => {
  //   dispatch(fetchTeams());
  // }, [dispatch]);

  // TODO: Remove this mock data once Redux is properly implemented
  const teams = [];
  const loading = false;

  if (loading) {
    return <Spinner text="Loading teams..." />;
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h1>Teams</h1>
          <p className="text-muted">Explore all football teams</p>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="alert alert-info">
          <p>No teams found. TODO: Implement team fetching</p>
        </div>
      ) : (
        <div className="row">
          {/* TODO: Map through teams and render cards
          {teams.map((team) => (
            <div key={team.id} className="col-md-6 col-lg-4 mb-4">
              <Card
                onClick={() => navigate(`/teams/${team.id}`)}
                className="h-100"
              >
                <CardBody>
                  <img src={team.logo} alt={team.name} style={{ maxWidth: '100%', height: 'auto' }} />
                  <h5 className="card-title mt-3">{team.name}</h5>
                  <p className="card-text">{team.country}</p>
                  {/* Display team stats */}
                </CardBody>
              </Card>
            </div>
          ))}
          */}
        </div>
      )}
    </div>
  );
};
