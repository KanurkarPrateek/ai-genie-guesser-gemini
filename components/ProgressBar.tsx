
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full bg-slate-700 rounded-full h-4 my-2 overflow-hidden border-2 border-slate-600">
      <div
        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
