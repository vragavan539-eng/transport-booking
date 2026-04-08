import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="page-loader">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
