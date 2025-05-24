import { Topic } from './types';

// ===== CUSTOMIZE YOUR APP TITLE HERE =====
export const APP_TITLE = "Your Tutorial Title";

// ===== TUTORIAL CONTENT =====
// Modify the topics array below to create your own tutorial content
// Each topic follows the structure defined in the Topic interface (see types.ts)

export const TOPICS_DATA: Topic[] = [
  {
    id: 'topic1',
    title: 'Topic 1: Getting Started',
    path: '/topic1',
    explanation: `
      <p class="mb-4">Welcome to your tutorial! This is the first topic in your tutorial series. Replace this content with your own introduction.</p>
      <h3 class="text-xl font-semibold mb-2 text-sky-700">Key Points</h3>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li><strong>Point 1:</strong> Describe your first key point here.</li>
        <li><strong>Point 2:</strong> Describe your second key point here.</li>
        <li><strong>Point 3:</strong> Describe your third key point here.</li>
      </ul>
      <p>This tutorial will guide you through all the important concepts. Navigate through the topics using the sidebar.</p>
    `,
    codeExample: {
      description: "Example code snippet:",
      code: `
// Replace this with your own code example
function ExampleComponent() {
  return <h1>Hello, World!</h1>;
}

// Usage example:
// <ExampleComponent />`,
      outputDescription: "Describe what this code would output when run."
    },
    interactiveExample: {
      description: "Describe how users can interact with or experiment with the concepts in this topic.",
      tasks: ["Task 1: Describe the first task for the user", "Task 2: Describe the second task for the user"]
    },
    exercise: {
      title: "Practice Exercise",
      description: "Describe the exercise that users should complete to practice the concepts from this topic.",
      solutionHint: "Provide a hint for solving the exercise without giving away the full solution.",
      miniTasks: [
        {
          task: "Mini-task 1: Describe the first step of the exercise.",
          code: `// Starter code for mini-task 1
// Replace with your own starter code

const Task1 = () => {
  // Code to be completed by the user
};

export default Task1;`,
          hint: "Hint for completing mini-task 1"
        },
        {
          task: "Mini-task 2: Describe the second step of the exercise.",
          code: `// Starter code for mini-task 2
// Replace with your own starter code

function App() {
  return (
    <div className="App">
      {/* User should add their component here */}
    </div>
  );
}

export default App;`,
          hint: "Hint for completing mini-task 2"
        }
      ]
    },
    quiz: {
      question: "Example quiz question for this topic?",
      options: [
        { id: "a", text: "Option A" },
        { id: "b", text: "Option B" },
        { id: "c", text: "Option C" },
        { id: "d", text: "Option D" }
      ],
      correctAnswerId: "b",
      explanation: "Explanation of why Option B is the correct answer."
    },
    keywords: ["keyword1", "keyword2", "keyword3", "keyword4"]
  },
  {
    id: 'topic2',
    title: 'Topic 2: Next Steps',
    path: '/topic2',
    explanation: `
      <p class="mb-4"><strong>Key Concept 1</strong> - Provide an explanation of the first key concept for this topic. This should be a clear, concise explanation that helps users understand the fundamentals.</p>
      <p class="mb-4"><strong>Key Concept 2</strong> - Explain the second important concept. You can use HTML formatting within these template strings to create rich content with proper styling.</p>
      <h3 class="text-xl font-semibold mb-2 text-sky-700">Important Points:</h3>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li><strong>Point 1:</strong> Describe an important point about this topic.</li>
        <li><strong>Point 2:</strong> Describe another important point.
          <ul class="list-circle list-inside ml-4">
            <li>Sub-point 1: Add more detailed information here.</li>
            <li>Sub-point 2: Add more detailed information here.</li>
            <li>Sub-point 3: Add more detailed information here.</li>
          </ul>
        </li>
      </ul>
    `,
    codeExample: {
      description: "Example code for this topic:",
      code: `
// Replace with your own example code
function ExampleComponent(props) {
  const value = props.value || "Default";
  return (
    <div className="example">
      <h2>{value}</h2>
      <p>This is an example component.</p>
    </div>
  );
}

// Usage: <ExampleComponent value="Custom Value" />
      `,
      outputDescription: "Describe what this code would output when run with the given parameters."
    },
    interactiveExample: {
      description: "Describe how users can interact with this topic's concepts.",
      tasks: [
        "Task 1: Describe what the user should try first.",
        "Task 2: Describe what the user should try next.",
        "Task 3: Describe a final task for the user to try."
      ]
    },
    exercise: {
      title: "Practice Exercise for Topic 2",
      description: "Describe what the user should build or implement to practice the concepts from this topic.",
      solutionHint: "Provide a hint or partial solution without giving away the complete answer.",
      miniTasks: [
        {
          task: "Mini-task 1: Describe the first step of this exercise.",
          code: `// Starter code for the first mini-task
import React from 'react';

// Create an interface for the component props
interface ComponentProps {
  // Define the props types here
}

const ExampleComponent = (props) => {
  // User should implement this component
  return null;
};

export default ExampleComponent;`,
          hint: "Hint for completing the first mini-task"
        },
        {
          task: "Mini-task 2: Describe the second step of this exercise.",
          code: `// Starter code for the second mini-task
const ExampleComponent = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* User should add styling and content here */}
      <h2>{prop1}</h2>
      <p>{prop2}</p>
    </div>
  );
};`,
          hint: "Hint for completing the second mini-task"
        },
        {
          task: "Mini-task 3: Describe the final step of this exercise.",
          code: `// Starter code for the third mini-task
import React from 'react';
import ExampleComponent from './ExampleComponent';

function App() {
  // Create sample data
  const items = [
    // User should add sample data here
  ];
  
  return (
    <div className="App">
      <h1>My Application</h1>
      <div className="item-list">
        {/* User should render components here */}
      </div>
    </div>
  );
}`,
          hint: "Hint for completing the third mini-task"
        }
      ]
    },
    quiz: {
      question: "Example quiz question for Topic 2?",
      options: [
        { id: "a", text: "Option A" },
        { id: "b", text: "Option B" },
        { id: "c", text: "Option C" },
        { id: "d", text: "Option D" }
      ],
      correctAnswerId: "c",
      explanation: "Explanation of why Option C is the correct answer."
    },
    keywords: ["keyword1", "keyword2", "keyword3", "keyword4"]
  },
  {
    id: 'topic3',
    title: 'Topic 3: Advanced Concepts',
    path: '/topic3',
    explanation: `
      <p class="mb-4">This topic covers advanced concepts that build on the fundamentals from earlier topics. Replace this content with your own advanced topic explanation.</p>
      <h3 class="text-xl font-semibold mb-2 text-sky-700">Advanced Techniques</h3>
      <p class="mb-4">Explain the advanced techniques or patterns that users should understand at this stage.</p>
      <h4 class="text-lg font-semibold mb-2 text-sky-600">When to Use These Techniques</h4>
      <p class="mb-4">Provide guidance on when and why these advanced techniques should be applied in real-world scenarios.</p>
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p class="font-semibold">Important Note:</p>
        <p>Include any important warnings or considerations that users should keep in mind when applying these advanced concepts.</p>
      </div>
    `,
    codeExample: {
      description: "Advanced code example:",
      code: `
// Replace with your own advanced code example
function AdvancedComponent({ data, onUpdate, config = {} }) {
  const { showDetails = false, theme = 'light' } = config;
  
  // Process the data
  const processedData = data.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
  
  // Handle updates
  const handleChange = (id, value) => {
    const updatedData = processedData.map(item => 
      item.id === id ? { ...item, value } : item
    );
    onUpdate(updatedData);
  };
  
  return (
    <div className={"container " + theme}>
      <h2>Advanced Component</h2>
      {processedData.map(item => (
        <div key={item.id} className="item">
          <span>{item.name}</span>
          {showDetails && (
            <div className="details">
              <p>ID: {item.id}</p>
              <p>Timestamp: {item.timestamp}</p>
            </div>
          )}
          <input 
            type="text" 
            value={item.value} 
            onChange={(e) => handleChange(item.id, e.target.value)} 
          />
        </div>
      ))}
    </div>
  );
}
      `,
      outputDescription: "Describe what this advanced code example would output when run."
    },
    interactiveExample: {
      description: "Experiment with these advanced concepts:",
      tasks: [
        "Task 1: Try modifying the component to add additional features.",
        "Task 2: Implement error handling for edge cases.",
        "Task 3: Optimize the component for better performance."
      ]
    },
    exercise: {
      title: "Advanced Practice Exercise",
      description: "Create a complex component that demonstrates mastery of the advanced concepts covered in this topic.",
      solutionHint: "Focus on proper state management, optimization, and reusable patterns.",
      miniTasks: [
        {
          task: "Mini-task 1: Set up the component structure with proper TypeScript types.",
          code: `// Starter code
import React, { useState, useEffect } from 'react';

// Define your interfaces here
interface DataItem {
  id: string;
  name: string;
  value: string;
}

interface ComponentProps {
  initialData: DataItem[];
  onSave?: (data: DataItem[]) => void;
}

const AdvancedExercise: React.FC<ComponentProps> = ({ initialData, onSave }) => {
  // Implement state management here
  
  return (
    <div className="advanced-exercise">
      {/* Implement your component UI here */}
    </div>
  );
};

export default AdvancedExercise;`,
          hint: "Start by setting up state with useState and consider what effects you might need with useEffect"
        },
        {
          task: "Mini-task 2: Implement data manipulation functionality.",
          code: `// Inside your component
const [data, setData] = useState<DataItem[]>(initialData);

// Implement these functions
const addItem = () => {
  // Add a new item to the data array
};

const updateItem = (id: string, updates: Partial<DataItem>) => {
  // Update an existing item
};

const deleteItem = (id: string) => {
  // Remove an item from the data
};`,
          hint: "Remember to create new arrays when updating state, don't mutate the existing state directly"
        },
        {
          task: "Mini-task 3: Create a UI with forms and dynamic rendering.",
          code: `// Inside your component return statement
return (
  <div className="advanced-exercise">
    <h2>Data Manager</h2>
    
    {/* Add form here */}
    <form onSubmit={/* Your submit handler */}>
      {/* Form fields */}
    </form>
    
    {/* Data display */}
    <div className="data-list">
      {/* Map through data and render items */}
    </div>
    
    {/* Save button */}
    <button onClick={/* Save handler */}>
      Save Changes
    </button>
  </div>
);`,
          hint: "Consider using a separate ItemForm component for adding/editing items to keep your code modular"
        }
      ]
    },
    quiz: {
      question: "Which of the following is a best practice when working with the advanced concepts covered in this topic?",
      options: [
        { id: "a", text: "Option A: Always mutate state directly for better performance" },
        { id: "b", text: "Option B: Avoid TypeScript for complex components to reduce overhead" },
        { id: "c", text: "Option C: Use immutable patterns when updating state" },
        { id: "d", text: "Option D: Put all logic in a single component for easier maintenance" }
      ],
      correctAnswerId: "c",
      explanation: "Option C is correct. Using immutable patterns when updating state helps prevent bugs and makes your application more predictable. It also works well with React's rendering optimization."
    },
    keywords: ["advanced", "patterns", "optimization", "typescript", "state-management"]
  }
];
