import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNotifications, notificationActions } from '@redux/slices/notificationSlice';
import type { RootState } from '@redux/store';
import { Badge } from './common';

export const NotificationContainer: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => selectNotifications(state));

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        dispatch(notificationActions.removeNotification(notification.id));
      }, 5000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="toast show mb-2"
          style={{
            minWidth: '300px',
            backgroundColor: '#f8f9fa',
            borderLeft: `4px solid ${notification.type === 'goal' ? '#28a745' : '#17a2b8'}`,
          }}
        >
          <div className="toast-header">
            <Badge
              variant={notification.type === 'goal' ? 'success' : 'info'}
              className="me-2"
            >
              {notification.type.toUpperCase()}
            </Badge>
            <strong className="me-auto">{notification.title}</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(notificationActions.removeNotification(notification.id))}
            />
          </div>
          <div className="toast-body">
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  );
};
