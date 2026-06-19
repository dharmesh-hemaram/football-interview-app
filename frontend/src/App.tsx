import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Initialize WebSocket
    socketService.connect();

    // Listen for notifications
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
        {/* COMPLETE - Players routes */}
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:id" element={<PlayerDetailPage />} />

        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
        <Route path="/matches" element={<MatchesPage />} />

        {/* Redirect to players as default */}
        <Route path="/" element={<PlayersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
