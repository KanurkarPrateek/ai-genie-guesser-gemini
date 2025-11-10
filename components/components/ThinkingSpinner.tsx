
import React from 'react';

const ThinkingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      <p className="text-lg text-slate-300 font-semibold animate-pulse">The Genie is thinking...</p>
    </div>
  );
};

export default ThinkingSpinner;
