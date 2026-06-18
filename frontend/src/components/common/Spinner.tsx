import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  text = 'Loading...',
}) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';

  return (
    <div className="d-flex align-items-center justify-content-center my-4">
      <div className={`spinner-border ${sizeClass} ${className}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};
