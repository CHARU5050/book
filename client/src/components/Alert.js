import React from 'react';

function Alert({ message, color }) {
  return (
    <div className={`alert alert-${color} alert-dismissible fade show`} role="alert" style={{ position: 'absolute', top: 10, left: 1000, right: 30, zIndex: 999 }}>
      <strong style={{ fontSize: '1.5rem' }}>{message}</strong>
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  );
}

export default Alert;
