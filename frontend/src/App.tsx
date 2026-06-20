import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@redux/store';
import { socketService } from '@services/socket';
import { notificationActions } from '@redux/slices/notificationSlice';
import { Navbar } from '@components/Navbar';
import { NotificationContainer } from '@components/NotificationContainer';
import { PlayersPage } from '@pages/PlayersPage';
import { PlayerDetailPage } from '@pages/PlayerDetailPage';
import { TeamsPage } from '@pages/TeamsPage';
import { TeamDetailPage } from '@pages/TeamDetailPage';
import { MatchesPage } from '@pages/MatchesPage';
import { MatchDetailPage } from '@pages/MatchDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socketService.connect();
    socketService.onNotification((notification) => {
      dispatch(notificationActions.addNotification(notification));
    });
    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <NotificationContainer />
      <Routes>
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:id" element={<PlayerDetailPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/matches/:id" element={<MatchDetailPage />} />
        <Route path="/" element={<Navigate to="/teams" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
