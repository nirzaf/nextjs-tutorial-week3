
import React from 'react';

interface InteractiveExampleProps {
  description: string;
  tasks?: string[];
}

export const InteractiveExample: React.FC<InteractiveExampleProps> = ({ description, tasks }) => {
  return (
    <div className="p-6 bg-slate-700/30 rounded-lg shadow-md">
      <p className="text-gray-300 mb-4">{description}</p>
      {tasks && tasks.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 text-yellow-400">Things to try:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
      )}
       <p className="mt-4 text-sm text-gray-400 italic">
        To truly experiment, we recommend setting up a local React development environment (e.g., using Vite or Create React App) and trying these examples yourself!
      </p>
    </div>
  );
};
    