import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ isOpen, onClose, notifications }) => {
  if (!notifications || !Array.isArray(notifications)) {
    console.error('Notifications is not defined or not an array');
    return null;
  }

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <button onClick={onClose}>Close</button>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))
        ) : (
          <li>No notifications</li>
        )}
      </ul>
    </div>
  );
};

Notification.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
};

export default Notification;
