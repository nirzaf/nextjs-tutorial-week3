# React Tutorial Template

A comprehensive React tutorial template with interactive examples, quizzes, and exercises. This template is designed to help you create educational content for teaching React concepts.

## Features

- 📚 Structured tutorial format with explanations, code examples, and interactive elements
- 🧩 Interactive examples to demonstrate concepts
- ✏️ Exercises for hands-on practice
- 🎯 Quizzes to test understanding
- 🔍 Search functionality to find specific topics
- 📱 Responsive design with Tailwind CSS
- 🌐 Easy deployment to GitHub Pages or any other hosting service

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone this repository
   ```bash
   git clone <your-repository-url>
   cd react-tutorial-template
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Customizing the Tutorial Content

The tutorial content is defined in the `constants.tsx` file. You can modify the `TOPICS_DATA` array to add, remove, or update topics.

Each topic has the following structure:

- `id`: Unique identifier for the topic
- `title`: Topic title
- `path`: URL path for the topic
- `explanation`: HTML content explaining the topic
- `codeExample`: Code snippet demonstrating the concept
- `interactiveExample`: Interactive component to demonstrate the concept
- `exercise`: Practice exercise for the topic
- `quiz`: Quiz to test understanding
- `keywords`: Keywords for search functionality

## Deployment

### GitHub Pages

1. Update the `vite.config.ts` file to set the correct base path for your repository
2. Run the deploy command
   ```bash
   npm run deploy
   ```

### Other Hosting Services

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your hosting service

## License

MIT
