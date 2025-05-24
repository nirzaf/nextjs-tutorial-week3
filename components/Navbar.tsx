
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Topic } from '../types';

interface NavbarProps {
  topics: Topic[];
  searchTerm?: string;
}

// Function to highlight search term in text
const highlightText = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return parts.map((part, index) => {
    return part.toLowerCase() === searchTerm.toLowerCase() ? 
      <span key={index} className="bg-sky-600 text-white font-semibold">{part}</span> : part;
  });
};

export const Navbar: React.FC<NavbarProps> = ({ topics, searchTerm = '' }) => {
  if (topics.length === 0) {
    return <p className="text-gray-400">No topics match your search.</p>;
  }
  return (
    <nav>
      <ul className="space-y-2">
        {topics.map(topic => (
          <li key={topic.id}>
            <NavLink
              to={`/topic/${topic.id}`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-gray-300 hover:bg-sky-700 hover:text-white transition-colors duration-150 ease-in-out ${
                  isActive ? 'bg-sky-600 text-white font-semibold shadow-md' : 'bg-slate-700/50'
                }`
              }
            >
              {highlightText(topic.title, searchTerm)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
    