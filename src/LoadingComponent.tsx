import React from 'react';
import './Styles/loaderStyles.scss';

interface LoadingComponentProps {
  isLoading: boolean;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        {/* Animated spinner */}
        <div className="loading-spinner"></div>
        
        {/* Loading text */}
        <div className="loading-text">Loading...</div>
        
        {/* Optional pulsing dots */}
        <div className="loading-dots">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;