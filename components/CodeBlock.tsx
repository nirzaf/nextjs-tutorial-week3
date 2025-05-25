
import React from 'react';
import { PrismAsyncLight } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

PrismAsyncLight.registerLanguage('javascript', javascript);
PrismAsyncLight.registerLanguage('jsx', jsx);
PrismAsyncLight.registerLanguage('bash', bash);
PrismAsyncLight.registerLanguage('typescript', typescript);
PrismAsyncLight.registerLanguage('tsx', tsx);
PrismAsyncLight.registerLanguage('json', json);

interface CodeBlockProps {
  code: string;
  language?: string; // For potential future syntax highlighting
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden my-4">
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
      <PrismAsyncLight language={language} style={okaidia} PreTag="div">
        {code.trim()}
      </PrismAsyncLight>
    </div>
  );
};
    