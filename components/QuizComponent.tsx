
import React, { useState } from 'react';
import { Quiz, QuizOption } from '../types';

interface QuizComponentProps {
  quiz: Quiz;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (!submitted) {
      setSelectedOptionId(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOptionId) {
      setSubmitted(true);
    } else {
      alert("Please select an answer before submitting.");
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setSubmitted(false);
  };

  const isCorrect = selectedOptionId === quiz.correctAnswerId;

  return (
    <div className="p-6 bg-slate-700/30 rounded-lg shadow-md">
      <p className="text-xl font-medium mb-4 text-gray-100">{quiz.question}</p>
      <div className="space-y-3 mb-6">
        {quiz.options.map((option: QuizOption) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={submitted}
            className={`w-full text-left p-3 rounded-md transition-all duration-150 ease-in-out border-2
              ${submitted ? 
                (option.id === quiz.correctAnswerId ? 'bg-green-500/30 border-green-500 text-white' : 
                 (option.id === selectedOptionId ? 'bg-red-500/30 border-red-500 text-white' : 'bg-slate-600/50 border-slate-500 text-gray-300')) :
                (selectedOptionId === option.id ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-600/50 border-slate-500 hover:bg-sky-700/50 hover:border-sky-600 text-gray-300')
              }
              ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="font-mono mr-2 bg-slate-800/50 px-2 py-1 rounded text-sm">{option.id.toUpperCase()}.</span>
            {option.text}
            {submitted && option.id === quiz.correctAnswerId && <span className="ml-2 text-sm font-bold">(Correct)</span>}
            {submitted && option.id === selectedOptionId && option.id !== quiz.correctAnswerId && <span className="ml-2 text-sm font-bold">(Your Answer)</span>}
          </button>
        ))}
      </div>
      
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selectedOptionId}
          className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      )}

      {submitted && (
        <div className="mt-4 p-4 rounded-md">
          {isCorrect ? (
            <p className="text-green-400 text-lg font-semibold">Correct! Well done.</p>
          ) : (
            <p className="text-red-400 text-lg font-semibold">Not quite. The correct answer was '{quiz.options.find(o => o.id === quiz.correctAnswerId)?.text}'.</p>
          )}
          {quiz.explanation && <p className="mt-2 text-sm text-gray-300">{quiz.explanation}</p>}
           <button
            onClick={handleReset}
            className="mt-4 px-6 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
    