import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  return (
    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500 ease-out"
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;