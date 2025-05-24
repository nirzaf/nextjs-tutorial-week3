
import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string; // For potential future syntax highlighting
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  return (
    <div className="bg-slate-900 rounded-lg shadow-lg overflow-hidden my-4">
      <div className="bg-slate-700/50 px-4 py-2 text-xs text-sky-300 font-mono flex justify-between items-center">
        <span>{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code.trim())}
          className="text-xs bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded-md transition-colors"
          title="Copy code"
        >
          Copy
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};
    