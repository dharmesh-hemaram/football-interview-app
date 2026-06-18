import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// TODO: Import required actions and selectors from matchSlice once implemented
// import { fetchMatches, selectMatches, selectMatchesLoading } from '@redux/slices/matchSlice';
import type { RootState, AppDispatch } from '@redux/store';
import { Card, CardBody, Badge, Spinner } from '@components/common';

export const MatchesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // TODO: Implement Redux selectors
  // const matches = useSelector((state: RootState) => selectMatches(state));
  // const teams = useSelector((state: RootState) => selectTeams(state));
  // const loading = useSelector((state: RootState) => selectMatchesLoading(state));

  // TODO: Remove mock data once Redux is implemented
  const matches = [];
  const loading = false;

  // TODO: Fetch matches on mount
  // useEffect(() => {
  //   dispatch(fetchMatches());
  // }, [dispatch]);

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
        <div className="alert alert-info">
          <p>No matches found. TODO: Implement match fetching</p>
        </div>
      ) : (
        <div className="row">
          {/* TODO: Map through matches and render
          {matches.map((match) => (
            <div key={match.id} className="col-md-6 mb-4">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Match ID: {match.id}</h5>
                    <Badge variant={match.status === 'live' ? 'danger' : 'success'}>
                      {match.status.toUpperCase()}
                    </Badge>
                  </div>
                  {/* Display home team vs away team */}
                  {/* Display score */}
                  {/* Display date/time */}
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
