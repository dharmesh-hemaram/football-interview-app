import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUnreadCount } from '@redux/slices/notificationSlice';
import type { RootState } from '@redux/store';

export const Navbar: React.FC = () => {
  const unreadCount = useSelector((state: RootState) => selectUnreadCount(state));

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ⚽ Football App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/players">
                Players
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/teams">
                Teams
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/matches">
                Matches
              </Link>
            </li>
            <li className="nav-item">
              <span className="nav-link">
                🔔 {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount}</span>}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
