
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { TopicView } from './components/TopicView';
import { TOPICS_DATA, APP_TITLE } from './constants';
import { Topic } from './types';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Enhanced search algorithm that searches in title, keywords, and explanation
  const filteredTopics = TOPICS_DATA.filter(topic => {
    if (!searchTerm.trim()) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Search in title
    if (topic.title.toLowerCase().includes(searchTermLower)) return true;
    
    // Search in keywords
    if (topic.keywords.some(keyword => keyword.toLowerCase().includes(searchTermLower))) return true;
    
    // Search in explanation (strip HTML tags first)
    const explanationText = topic.explanation.replace(/<[^>]*>/g, '');
    if (explanationText.toLowerCase().includes(searchTermLower)) return true;
    
    return false;
  });

  // Debounce search to avoid performance issues
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);
  
  // Function to clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-sky-800 text-gray-100">
        <header className="bg-slate-800/70 backdrop-blur-md shadow-lg p-4 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-sky-400">{APP_TITLE}</h1>
            <div className="relative w-1/3">
              <input 
                type="text"
                placeholder="Search topics..."
                className="w-full p-2 rounded bg-slate-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-sky-500 outline-none pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              {isSearching && (
                <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-sky-400">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-1 container mx-auto mt-4 overflow-hidden">
          <aside className="w-1/4 p-4 space-y-4 bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-md overflow-y-auto mr-4 max-h-[calc(100vh-120px)]">
            {filteredTopics.length < TOPICS_DATA.length && (
              <div className="text-sm text-sky-400 mb-2">
                Found {filteredTopics.length} of {TOPICS_DATA.length} topics
              </div>
            )}
            <Navbar topics={filteredTopics} searchTerm={searchTerm} />
          </aside>

          <main className="flex-1 p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-120px)]">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/topic/:topicId" element={<TopicWrapper />} />
              <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback to home */}
            </Routes>
          </main>
        </div>
        <footer className="text-center p-4 text-sm text-slate-400 bg-slate-800/70 backdrop-blur-md mt-auto">
          Quadrate Tech Solutions
        </footer>
      </div>
    </HashRouter>
  );
};

const WelcomePage: React.FC = () => {
  const introTopic = TOPICS_DATA.find(t => t.id === 'intro');
  if (!introTopic) return <p className="text-center text-xl mt-10">Welcome! Select a topic to begin.</p>;
  
  return (
     <div className="prose prose-invert max-w-none prose-h1:text-sky-400 prose-h2:text-sky-500 prose-a:text-sky-400 hover:prose-a:text-sky-300">
        <h1 className="text-4xl font-bold mb-6 text-sky-300">{introTopic.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: introTopic.explanation }} />
        {introTopic.codeExample.code && (
            <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-2 text-sky-500">Quick Example</h3>
                 <CodeBlock code={introTopic.codeExample.code} />
                 {introTopic.codeExample.outputDescription && <p className="text-sm italic mt-2 text-gray-400">{introTopic.codeExample.outputDescription}</p>}
            </div>
        )}
        <p className="mt-8 text-lg">
            Explore the topics in the sidebar to dive deeper into React!
        </p>
     </div>
  );
};

const TopicWrapper: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = TOPICS_DATA.find(t => t.id === topicId);

  if (!topic) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold text-red-400">Topic Not Found</h2>
        <p className="mt-4">The topic you are looking for does not exist. Please select one from the sidebar.</p>
        <Link to="/" className="mt-6 inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
          Go to Home
        </Link>
      </div>
    );
  }
  return <TopicView topic={topic} />;
};

// A helper link component for completeness, though not strictly needed for TopicWrapper
import { Link } from 'react-router-dom';
import { CodeBlock } from './components/CodeBlock';


export default App;
    