
import React from 'react';
import { Topic } from '../types';
import { CodeBlock } from './CodeBlock';
import { QuizComponent } from './QuizComponent';
import { ExerciseComponent } from './ExerciseComponent';
import { InteractiveExample } from './InteractiveExample';

interface TopicViewProps {
  topic: Topic;
}

export const TopicView: React.FC<TopicViewProps> = ({ topic }) => {
  return (
    <article className="prose prose-invert max-w-none prose-h1:text-sky-400 prose-h2:text-sky-500 prose-h3:text-sky-600 prose-a:text-sky-400 hover:prose-a:text-sky-300 prose-strong:text-sky-300 prose-code:bg-slate-700 prose-code:p-1 prose-code:rounded prose-code:text-sm prose-code:text-emerald-300 prose-pre:bg-slate-900 prose-pre:p-4 prose-pre:rounded-md">
      <header className="mb-8 pb-4 border-b border-slate-700">
        <h1 className="text-4xl font-extrabold tracking-tight text-sky-300">{topic.title}</h1>
      </header>

      <section id="explanation" className="mb-10">
        <h2 className="text-3xl font-semibold mb-4 flex items-center">
          <InfoIcon className="w-7 h-7 mr-3 text-sky-500" />
          Explanation
        </h2>
        <div dangerouslySetInnerHTML={{ __html: topic.explanation }} className="space-y-4" />
      </section>

      {topic.codeExample.code && (
        <section id="code-example" className="mb-10">
          <h2 className="text-3xl font-semibold mb-4 flex items-center">
            <CodeIcon className="w-7 h-7 mr-3 text-emerald-500" />
            Code Example
          </h2>
          {topic.codeExample.description && <p className="mb-3 text-lg text-gray-300">{topic.codeExample.description}</p>}
          <CodeBlock code={topic.codeExample.code} />
          {topic.codeExample.outputDescription && <p className="text-sm italic mt-3 text-gray-400 bg-slate-700/50 p-3 rounded-md">{topic.codeExample.outputDescription}</p>}
        </section>
      )}

      <section id="interactive-example" className="mb-10">
         <h2 className="text-3xl font-semibold mb-4 flex items-center">
            <SparklesIcon className="w-7 h-7 mr-3 text-yellow-500" />
            Interactive Example
        </h2>
        <InteractiveExample 
          description={topic.interactiveExample.description}
          tasks={topic.interactiveExample.tasks}
        />
      </section>

      <section id="exercise" className="mb-10">
        <h2 className="text-3xl font-semibold mb-4 flex items-center">
            <PencilIcon className="w-7 h-7 mr-3 text-purple-500" />
            Exercise
        </h2>
        <ExerciseComponent exercise={topic.exercise} />
      </section>

      <section id="quiz">
        <h2 className="text-3xl font-semibold mb-4 flex items-center">
            <QuestionMarkCircleIcon className="w-7 h-7 mr-3 text-red-500" />
            Quiz
        </h2>
        <QuizComponent quiz={topic.quiz} />
      </section>
    </article>
  );
};

// SVG Icons (Heroicons)
const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75l-1.25-1.75L14.25 12l1.5-1.75L17 8.5l1.25 1.75L19.75 12l-1.5 1.75z" />
</svg>
);

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
</svg>
);

const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
</svg>
);

    