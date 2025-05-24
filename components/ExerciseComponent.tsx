
import React, { useState } from 'react';
import { Exercise } from '../types';

interface ExerciseComponentProps {
  exercise: Exercise;
}

export const ExerciseComponent: React.FC<ExerciseComponentProps> = ({ exercise }) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="p-6 bg-slate-700/30 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3 text-gray-100">{exercise.title}</h3>
      <p className="text-gray-300 mb-4 whitespace-pre-line">{exercise.description}</p>
      {exercise.solutionHint && (
        <div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors mb-2"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && (
            <div className="p-3 bg-slate-600/50 rounded-md text-gray-300 text-sm prose prose-sm prose-invert prose-code:bg-slate-800 prose-code:p-1 prose-code:rounded">
              <p className="font-semibold">Hint:</p>
              <div dangerouslySetInnerHTML={{ __html: exercise.solutionHint.replace(/`(.*?)`/g, '<code>$1</code>') }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
    