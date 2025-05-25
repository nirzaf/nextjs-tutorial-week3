import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Topic } from '../types';
import { QuizComponent } from './QuizComponent';
import { ExerciseComponent } from './ExerciseComponent';
import { InteractiveExample } from './InteractiveExample';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { Components } from 'react-markdown';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Icons
const CodeIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const SparklesIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PencilIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const QuestionMarkCircleIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 1.436-2 2.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface TopicViewProps {
  topic: Topic;
}

export const TopicView: React.FC<TopicViewProps> = ({ topic }) => {
  // Define components for ReactMarkdown with proper type annotations
  const markdownComponents: Components = {
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className?.includes('language-');
      return !isInline ? (
        <div className="code-block my-6 rounded-lg overflow-hidden border border-slate-700/50">
          <div className="code-block-header flex justify-between items-center bg-slate-800/50 px-4 py-2 border-b border-slate-700/50">
            <span className="text-xs font-mono text-slate-400">
              {match?.[1] || 'code'}
            </span>
          </div>
          <div className="p-0 overflow-x-auto">
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match?.[1] || 'text'}
              PreTag="div"
              className="!bg-transparent !p-4 !m-0 text-sm sm:text-base"
              customStyle={{
                margin: '0',
                background: 'transparent',
                fontSize: '0.875em',
                lineHeight: '1.5'
              } as Record<string, string>}
              codeTagProps={{
                style: {
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                },
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : (
        <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-300">
          {children}
        </code>
      );
    },
    a: ({ node, href, children, ...props }) => (
      <a
        href={href}
        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    h1: ({ children, ...props }) => (
      <h1 className="text-4xl font-bold text-white mb-2" {...props}>{children}</h1>
    ),
    h2: ({ node, children, ...props }) => (
      <h2 className="text-2xl font-bold text-white mt-8 mb-3" {...props}>
        {children}
      </h2>
    ),
    h3: ({ node, children, ...props }) => (
      <h3 className="text-xl font-bold text-white mt-6 mb-2" {...props}>
        {children}
      </h3>
    ),
    p: ({ node, children, ...props }) => (
      <p className="text-slate-300 mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    ul: ({ node, children, ...props }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ node, children, ...props }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ node, children, ...props }) => (
      <li className="text-slate-300" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ node, children, ...props }) => (
      <blockquote
        className="border-l-4 border-emerald-500 pl-4 py-1 my-4 text-slate-300 italic"
        {...props}
      >
        {children}
      </blockquote>
    ),
    table: ({ node, children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-slate-700" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ node, children, ...props }) => (
      <thead className="bg-slate-800/50" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ node, children, ...props }) => (
      <tbody className="divide-y divide-slate-700" {...props}>
        {children}
      </tbody>
    ),
    th: ({ node, children, ...props }) => (
      <th
        className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ node, children, ...props }) => (
      <td className="px-4 py-2 text-sm text-slate-300" {...props}>
        {children}
      </td>
    ),
  };

  return (
    <article className="prose prose-invert prose-slate dark:prose-invert w-full max-w-none px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10 pb-6 border-b border-slate-700/50">
        <h1 className="text-4xl font-bold text-white mb-2">{topic.title}</h1>
        {topic.keywords && topic.keywords.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {topic.keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-sky-300 border border-slate-700/50"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </header>

      <section id="explanation" className="mb-10">
        <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-400">
                <InfoIcon />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-4">Explanation</h2>
              <div className="prose prose-slate dark:prose-invert prose-lg w-full">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {topic.explanation}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </section>

      {topic.codeExample?.code && (
        <section className="mb-10">
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400">
                  <CodeIcon />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Code Example
                </h2>
                <div className="code-block rounded-lg overflow-hidden border border-slate-700/50">
                  <div className="code-block-header bg-slate-800/50 px-4 py-2 border-b border-slate-700/50">
                    <span className="text-xs font-mono text-slate-400">
                      {topic.codeExample && 'language' in topic.codeExample ? String(topic.codeExample.language) : 'javascript'}
                    </span>
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={topic.codeExample && 'language' in topic.codeExample ? String(topic.codeExample.language) : 'javascript'}
                      PreTag="div"
                      className="!bg-transparent !p-4 !m-0 text-sm sm:text-base"
                      customStyle={{
                        margin: '0',
                        background: 'transparent',
                        fontSize: '0.875em',
                        lineHeight: '1.5'
                      } as Record<string, string>}
                      codeTagProps={{
                        style: {
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        },
                      }}
                    >
                      {topic.codeExample.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {topic.interactiveExample && (
        <section id="interactive-example" className="mb-10">
          <h2 className="text-3xl font-semibold mb-4 flex items-center">
            <div className="w-7 h-7 mr-3 text-yellow-500 flex items-center justify-center">
              <SparklesIcon />
            </div>
            Interactive Example
          </h2>
          <InteractiveExample
            description={topic.interactiveExample.description}
            tasks={topic.interactiveExample.tasks}
          />
        </section>
      )}

      {topic.exercise && (
        <section id="exercise" className="mb-10">
          <h2 className="text-3xl font-semibold mb-4 flex items-center">
            <div className="w-7 h-7 mr-3 text-blue-500 flex items-center justify-center">
              <PencilIcon />
            </div>
            Exercise
          </h2>
          <ExerciseComponent exercise={topic.exercise} />
        </section>
      )}

      {topic.quiz && (
        <section id="quiz">
          <h2 className="text-3xl font-semibold mb-4 flex items-center">
            <div className="w-7 h-7 mr-3 text-purple-500 flex items-center justify-center">
              <QuestionMarkCircleIcon />
            </div>
            Quiz
          </h2>
          <QuizComponent quiz={topic.quiz} />
        </section>
      )}
    </article>
  );
};

export default TopicView;