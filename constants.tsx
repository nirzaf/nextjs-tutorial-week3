import { Topic } from './types';

const markdownToHtml = (markdown: string): string => {
  // First, extract and save code blocks to prevent them from being processed by other rules
  const codeBlocks: string[] = [];
  let processedMarkdown = markdown.replace(/```([\s\S]*?)```/g, (match) => {
    const id = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return id;
  });

  // Process inline code (single backticks) and save them too
  const inlineCode: string[] = [];
  processedMarkdown = processedMarkdown.replace(/`([^`]+)`/g, (match, code) => {
    const id = `__INLINE_CODE_${inlineCode.length}__`;
    inlineCode.push(code);
    return id;
  });

  // Process the rest of markdown
  let html = processedMarkdown
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 text-sky-700">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 text-sky-800">$1</h2>')
    .replace(/^# (.*$)/m, '<h1 class="text-3xl font-bold mb-4 text-sky-900">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^\s{2,}- (.*$)/gim, '<li class="ml-8">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>');

  // Wrap list items in ul/ol
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
    if (match.includes('ml-8')) {
      return `<ul class="list-disc list-inside ml-4">${match}</ul>`;
    }
    return `<ul class="list-disc list-inside mb-4 space-y-1">${match}</ul>`;
  });
  
  // Clean up extra ul/ol wrapping
  html = html.replace(/<\/ul>\s*<ul/g, '');

  // Handle blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>');

  // Handle paragraphs
  html = html.split('\n\n').map(paragraph => {
    if (
      paragraph.trim() === '' ||
      paragraph.startsWith('<h') ||
      paragraph.startsWith('<ul') ||
      paragraph.startsWith('<blockquote') ||
      paragraph.startsWith('<pre') ||
      paragraph.startsWith('__CODE_BLOCK_') ||
      paragraph.startsWith('<table')
    ) {
      return paragraph;
    }
    if (paragraph.trim() === '---') {
      return '<hr class="my-4" />';
    }
    return `<p class="mb-4">${paragraph}</p>`;
  }).join('');

  // Restore inline code with proper HTML
  inlineCode.forEach((code, i) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    html = html.replace(
      `__INLINE_CODE_${i}__`,
      `<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm">${escapedCode}</code>`
    );
  });

  // Restore code blocks with proper HTML
  codeBlocks.forEach((block, i) => {
    // More comprehensive regex to handle various code block formats
    const match = block.match(/```(?:(bash|javascript|js|typescript|ts|toml|dockerfile|css|html))?\s*\n([\s\S]*?)\n```/);
    if (match) {
      const lang = match[1] || '';
      const code = match[2];
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      html = html.replace(
        `__CODE_BLOCK_${i}__`,
        `<pre><code class="language-${lang}">${escapedCode}</code></pre>`
      );
    } else {
      // Just in case the regex didn't match
      html = html.replace(`__CODE_BLOCK_${i}__`, block);
    }
  });

  // Final cleanup
  html = html.replace(/<p class="mb-4">\s*<\/p>/g, '');
  html = html.replace(/<ul class="list-disc list-inside mb-4 space-y-1">\s*<\/ul>/g, '');
  html = html.replace(/<hr class="my-4" \/>\s*<h/g, '<hr class="my-4" /><h');

  return html.trim();
};

const extractSection = (content: string, startMarker: string, endMarker: string = ''): string => {
  let startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return '';
  startIndex += startMarker.length;

  let endIndex = content.length;
  if (endMarker) {
    endIndex = content.indexOf(endMarker, startIndex);
    if (endIndex === -1) endIndex = content.length;
  }
  return content.substring(startIndex, endIndex).trim();
};


const getAllCodeBlocks = (content: string) => {
  // Improved regex to better match code blocks with or without language specification
  const matches = content.matchAll(/```(?:(bash|javascript|js|typescript|ts|toml|dockerfile|css|html))?\s*\n([\s\S]*?)\n```/g);
  return Array.from(matches).map(match => match[2].trim());
};


const extractQuestionAndTask = (content: string) => {
  let quizQuestion = '';
  let exerciseTasks: { task: string; code: string; hint: string }[] = [];

  const questionsAndTasksBlock = extractSection(content, '## Questions & Tasks', '[Next:');
  if (!questionsAndTasksBlock) return { quizQuestion, exerciseTasks };

  const lines = questionsAndTasksBlock.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  let currentCodeBlock = '';
  let inCodeBlock = false;
  let inTaskSection = false;
  let currentTaskText = '';

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock && currentCodeBlock) {
        if (inTaskSection && currentTaskText) {
          exerciseTasks.push({
            task: currentTaskText.split('\n')[0].trim(),
            code: currentCodeBlock,
            hint: 'Review the section\'s content for guidance.'
          });
          currentTaskText = '';
        }
        currentCodeBlock = '';
      }
      continue;
    }

    if (inCodeBlock) {
      currentCodeBlock += line + '\n';
      continue;
    }

    if (line.startsWith('Task:')) {
      inTaskSection = true;
      currentTaskText = line.substring('Task:'.length).trim();
      // If task has text directly on same line
      if (currentTaskText && !currentTaskText.includes('```')) {
        // If there's no code block immediately after, it's a text-only task.
        const nextLineIndex = lines.indexOf(line) + 1;
        if (nextLineIndex < lines.length && !lines[nextLineIndex].startsWith('```')) {
            exerciseTasks.push({ task: currentTaskText, code: '', hint: 'Review the section\'s content for guidance.' });
            currentTaskText = '';
        }
      }
    } else if (inTaskSection && line.startsWith('//')) { // Mini-task starter code
        currentTaskText += '\n' + line; // Accumulate task text until code block starts
    } else if (line.match(/^\d+\. \*\*.*\*\*$/) || line.match(/^\d+\. .*/)) { // General question
      if (!quizQuestion) {
        quizQuestion = line.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim();
      }
    } else if (line.startsWith('- ')) { // Part of an exercise sub-point
        if (inTaskSection) {
            currentTaskText += '\n' + line;
        }
    }
  }

  return { quizQuestion, exerciseTasks };
};


const generateQuizOptions = (correctText: string, topicTitle: string) => {
  const options = [
    { id: "a", text: correctText },
    { id: "b", text: `An incorrect option related to ${topicTitle} (B)` },
    { id: "c", text: `Another incorrect option related to ${topicTitle} (C)` },
    { id: "d", text: `A misleading option about ${topicTitle} (D)` }
  ];

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
};


const processMarkdownFile = (fileName: string, content: string): Topic => {
  const id = fileName.replace(/\.md$/, '').replace(/^\d+\-/, '').replace(/\./g, '-');
  const path = `/${id}`;

  const titleMatch = content.match(/^# (.*$)/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Topic';

  const summarySectionMarker = content.includes('## Summary') ? '## Summary' : '## Summary:';
  const questionsTasksSectionMarker = content.includes('## Questions & Tasks') ? '## Questions & Tasks' : '## Questions & Tasks:';
  
  let explanationContent = '';
  // Find content between title and next major section (or end of file)
  const contentStart = titleMatch ? content.indexOf(titleMatch[0]) + titleMatch[0].length : 0;
  let contentEnd = content.length;

  if (content.includes(summarySectionMarker, contentStart)) {
    contentEnd = Math.min(contentEnd, content.indexOf(summarySectionMarker, contentStart));
  }
  if (content.includes(questionsTasksSectionMarker, contentStart)) {
    contentEnd = Math.min(contentEnd, content.indexOf(questionsTasksSectionMarker, contentStart));
  }
  // This handles the `[Next: ...]` link at the very end of `1-8` series files
  if (content.includes('[Next:', contentStart)) {
    contentEnd = Math.min(contentEnd, content.indexOf('[Next:', contentStart));
  }

  explanationContent = content.substring(contentStart, contentEnd).trim();
  

  explanationContent = explanationContent
    .replace('---', '')
    .replace(/## \d+\. Learning Objectives/g, '')
    .replace(/## \d+\. (Introduction to Next.js|Creating Your First Page|Adding an About Page|Type-Safe Routing|Basic Styling: Global CSS|Activity: Customize Your Pages|Server-Side Rendering \(SSR\)|Static Site Generation \(SSG\)|Automatic Code Splitting|API Routes \(Intro\)|Developer Experience \(DX\) Benefits|Rendering Strategies in Next.js|Activity: Explore Next.js Features|Creating a Next.js \+ TypeScript Project|Understanding the Project Structure|Key Files Explained|Activity: Explore Your Project|Basic Page Creation & Configuration with TypeScript)/g, '')
    .trim();


  // Extract Quiz and Exercise
  let quiz: Topic['quiz'] = { question: '', options: [], correctAnswerId: '', explanation: '' };
  let exercise: Topic['exercise'] = { title: '', description: '', solutionHint: '', miniTasks: [] };
  
  const questionsTasksSectionText = extractSection(content, questionsTasksSectionMarker);
  if (questionsTasksSectionText) {
    const { quizQuestion, exerciseTasks } = extractQuestionAndTask(content); // Pass full content to get the context for the task code

    if (quizQuestion) {
      quiz.question = quizQuestion;
      const correctOptionText = `The primary concept of ${title.split('. ')[1] || title}.`;
      quiz.options = generateQuizOptions(correctOptionText, title);
      quiz.correctAnswerId = quiz.options.find(opt => opt.text.includes(correctOptionText))?.id || "a"; // Use includes for safer match
      quiz.explanation = `The core idea of this section is: ${correctOptionText}. Refer back to the topic for details.`;
    }

    if (exerciseTasks.length > 0) {
      exercise.title = `Practice Exercise: ${title}`;
      exercise.description = "Complete the following tasks to apply the concepts learned in this section.";
      exercise.solutionHint = "Review the provided code examples and explanations for guidance.";
      exercise.miniTasks = exerciseTasks;
    }
  }

  // Extract general code examples (all of them)
  const allCodeBlocks = getAllCodeBlocks(content);
  let codeExample: Topic['codeExample'] = { description: "Illustrative code example(s) from this topic:", code: '', outputDescription: "The code demonstrates key concepts or functionality." };
  if (allCodeBlocks.length > 0) {
      codeExample.code = allCodeBlocks.join('\n\n/* --- Next Code Block --- */\n\n'); // Join all blocks
      if (allCodeBlocks.length === 1) {
          codeExample.description = "Illustrative code example:";
      } else {
          codeExample.description = "Multiple code examples from this topic:";
      }
  }

  // Try to find an "Activity" or "Project Activity" section for interactive example
  let interactiveExample: Topic['interactiveExample'] = { description: "Explore the concepts with an activity.", tasks: [] as string[] };
  const activityMatch = content.match(/## \d+\. (Project )?Activity: ([^\n]+)\n([\s\S]+?)(?=(## \d+\. |---|$))/);
  if (activityMatch) {
    const activityHeading = activityMatch[2].trim();
    const activityContent = activityMatch[3].trim();
    interactiveExample.description = `${activityHeading}.`;
    interactiveExample.tasks = activityContent.split('\n')
                                            .filter(line => line.trim().length > 5 && !line.includes('> **Goal:**')) // filter short lines and goal
                                            .map(line => line.replace(/^- /, '').replace(/^\d+\. /, '').trim());
    if (interactiveExample.tasks.length === 0) {
        interactiveExample.tasks = [activityContent.split('\n')[0].trim()];
    }
  }

  // Fallback for interactive example if no specific activity found
  if (!interactiveExample.tasks || interactiveExample.tasks.length === 0) {
    interactiveExample = {
      description: "Experiment with the concepts presented in this topic.",
      tasks: [
        "Review the main explanations and code examples.",
        "Consider how these concepts could be applied in a real-world Next.js application.",
        "If code is provided, try to run it locally and modify it to see the effects."
      ]
    };
  }


  // Populate generic quiz and exercise if not already filled by specific section parsing
  if (!quiz.question) {
    quiz = {
      question: `What is a key concept covered in "${title}"?`,
      options: generateQuizOptions(`A fundamental idea from ${title}`, title),
      correctAnswerId: 'a', // Default to 'a' if not shuffled
      explanation: `This question covers a core concept from the topic "${title}".`
    };
  }

  if (!exercise.title) {
    exercise = {
      title: `General Practice for "${title}"`,
      description: "Practice the main ideas from this topic to solidify your understanding.",
      solutionHint: "Refer back to the explanation and code examples in this section.",
      miniTasks: [
        {
          task: "Summarize the primary learning objective in your own words.",
          code: "// Write your summary or a simple code snippet here",
          hint: "Focus on the 'Summary' section of this topic."
        }
      ]
    };
  }


  const keywords = [...new Set([
    ...title.split(' ').filter(w => w.length > 2),
    ...explanationContent.split(/[\s,.]+/).filter(w => w.length > 2).map(w => w.toLowerCase()).slice(0, 5)
  ])].slice(0, 5);

  return {
    id,
    title,
    path,
    explanation: markdownToHtml(explanationContent),
    codeExample,
    interactiveExample,
    exercise,
    quiz,
    keywords: keywords.map(k => k.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()).filter(k => k.length > 2)
  };
};


const readmeContent = `# Next.js Tutorial for Beginners

Welcome to this comprehensive Next.js tutorial! This guide will walk you through how to get started with Next.js and explore its key features. By the end, you'll have a solid understanding of how to build fast, SEO-friendly, and production-ready web applications with Next.js.

## Table of Contents

1. [What is Next.js?](./1-what-is-nextjs.md)
2. [Setting Up Your Next.js Project](./2-setting-up-nextjs-project.md)
3. [Creating Pages in Next.js](./3-creating-pages.md)
4. [Linking Between Pages](./4-linking-between-pages.md)
5. [Adding Static Assets](./5-adding-static-assets.md)
6. [Server-Side Rendering and Static Site Generation](./6-ssr-and-ssg.md)
7. [Creating API Routes](./7-creating-api-routes.md)
8. [Deploying Your Next.js App](./8-deploying-nextjs-app.md)

---

> **Project Focus:**
> Throughout this tutorial, you'll build a modern web application using Next.js, learning essential concepts and best practices along the way.
`;

const file1Content = `# 1. What is Next.js?

Next.js is a React framework that simplifies building fast, SEO-friendly, and production-ready web applications. It's built on top of React, so you get the benefits of React's component-based architecture, but it also comes with additional features that help you build full-stack applications easily.

## Key Features:

* **Server-Side Rendering (SSR)**: Renders pages on the server for improved performance and SEO
* **Static Site Generation (SSG)**: Pre-renders pages at build time for optimal performance
* **API Routes**: Create backend API endpoints within your Next.js app
* **Fast Refresh**: Instant feedback during development
* **Built-in CSS and Sass Support**: Style your application with ease
* **TypeScript Support**: First-class TypeScript integration
* **Optimized Performance**: Automatic code splitting, image optimization, and more
* **File-System Based Routing**: Simple and intuitive routing based on your file structure

## Why Choose Next.js?

Next.js solves many common challenges in web development:

1. **Performance**: Server-side rendering and static generation improve page load times and user experience
2. **SEO**: Pre-rendered content is more easily indexed by search engines
3. **Developer Experience**: Simplified setup, hot reloading, and intuitive routing
4. **Scalability**: Built to handle applications of any size
5. **Versatility**: Works for static blogs, e-commerce sites, dashboards, and more

## Real-World Use Cases

Next.js is used by thousands of companies, including:

- **E-commerce sites**: Product pages benefit from SSG for performance and SEO
- **Blogs and content sites**: Articles can be statically generated or server-rendered
- **Marketing websites**: Fast-loading, SEO-friendly landing pages
- **Web applications**: Interactive dashboards with API routes for backend functionality
- **Documentation sites**: Static generation for fast, searchable documentation

In the next section, we'll set up your first Next.js project and explore its structure.

[Next: Setting Up Your Next.js Project →](./2-setting-up-nextjs-project.md)`;

const file2Content = `# 2. Setting Up Your Next.js Project

Before we start coding, ensure that you have Node.js and npm installed on your computer. If you don't have them, you can download and install them from [nodejs.org](https://nodejs.org/).

## Creating a New Next.js Project

Next.js provides a simple way to create a new project with all the necessary configuration:

1. **Install Next.js** using the following command:

   \`\`\`bash
   npx create-next-app@latest my-next-app
   \`\`\`

   This will create a new folder called \`my-next-app\` with all the necessary files.

2. **Navigate to your project directory:**

   \`\`\`bash
   cd my-next-app
   \`\`\`

3. **Run the development server:**

   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and go to [http://localhost:3000](http://localhost:3000). You should see the default Next.js welcome page.

## Understanding the Project Structure

After creating a new Next.js project, you'll see the following directory structure:

\`\`\`
my-next-app/
├── node_modules/
├── public/          # Static files (images, fonts, etc.)
├── pages/           # Pages and API routes
│   ├── api/         # API endpoints
│   ├── _app.js      # Custom App component
│   └── index.js     # Home page
├── styles/          # CSS files
├── .eslintrc.json   # ESLint configuration
├── .gitignore       # Git ignore file
├── next.config.js   # Next.js configuration
├── package.json     # Project dependencies
└── README.md        # Project documentation
\`\`\`

### Key Directories and Files:

- **pages/**: Contains all your pages and API routes. Each file becomes a route based on its name.
- **public/**: Stores static assets like images, fonts, and other files.
- **styles/**: Contains CSS files for styling your application.
- **next.config.js**: Configuration file for customizing Next.js.
- **package.json**: Lists project dependencies and scripts.

## Configuration Options

Next.js is designed to work out of the box with minimal configuration, but you can customize it using the \`next.config.js\` file:

\`\`\`javascript
// next.config.js
module.exports = {
  reactStrictMode: true,  // Enable React strict mode
  images: {
    domains: ['example.com'],  // Allow images from this domain
  },
  // Other configuration options
}
\`\`\`

## Adding TypeScript Support

Next.js has built-in TypeScript support. To use TypeScript in your project:

1. Create a new Next.js project with TypeScript:

   \`\`\`bash
   npx create-next-app@latest my-typescript-app --typescript
   \`\`\`

   Or add TypeScript to an existing project:

   \`\`\`bash
   touch tsconfig.json
   npm install --save-dev typescript @types/react @types/node
   \`\`\`

2. Run the development server, and Next.js will automatically configure TypeScript:

   \`\`\`bash
   npm run dev
   \`\`\`

## Summary

You've now set up a Next.js project and understand its basic structure. In the next section, we'll learn how to create pages in Next.js using its file-based routing system.

[Next: Creating Pages in Next.js →](./3-creating-pages.md)`;

const file3Content = `# 3. Creating Pages in Next.js

Next.js uses a **file-based routing system**, which means that every file you create inside the \`pages\` directory automatically becomes a route in your application. This intuitive approach simplifies the routing process and makes your application structure easy to understand.

## Basic Page Creation

To create a new page in Next.js, simply add a JavaScript or TypeScript file to the \`pages\` directory:

### Example: Creating an About Page

1. Create a new file called \`about.js\` in the \`pages\` directory:

\`\`\`javascript
// pages/about.js

export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page of our Next.js application.</p>
    </div>
  );
}
\`\`\`

2. Access your new page by navigating to \`http://localhost:3000/about\` in your browser.

## Nested Routes

You can create nested routes by adding files to subdirectories within the \`pages\` directory:

### Example: Creating a Nested Route

1. Create a directory called \`blog\` inside the \`pages\` directory.
2. Add a file called \`index.js\` inside the \`blog\` directory:

\`\`\`javascript
// pages/blog/index.js

export default function Blog() {
  return (
    <div>
      <h1>Blog</h1>
      <p>Welcome to our blog!</p>
    </div>
  );
}
\`\`\`

3. Access this page at \`http://localhost:3000/blog\`.

4. Create another file called \`first-post.js\` inside the \`blog\` directory:

\`\`\`javascript
// pages/blog/first-post.js

export default function FirstPost() {
  return (
    <div>
      <h1>First Post</h1>
      <p>This is my first blog post!</p>
    </div>
  );
}
\`\`\`

5. Access this page at \`http://localhost:3000/blog/first-post\`.

## Dynamic Routes

Next.js supports dynamic routes using brackets \`[]\` in the filename:

### Example: Creating a Dynamic Route

1. Create a file called \`[id].js\` inside the \`blog\` directory:

\`\`\`javascript
// pages/blog/[id].js
import { useRouter } from 'next/router';

export default function Post() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Post: {id}</h1>
      <p>This is post #{id}</p>
    </div>
  );
}
\`\`\`

2. Access this page with different IDs, such as \`http://localhost:3000/blog/1\` or \`http://localhost:3000/blog/hello-world\`.

## Custom 404 Page

Next.js allows you to create a custom 404 page by adding a \`404.js\` file to the \`pages\` directory:

\`\`\`javascript
// pages/404.js

export default function Custom404() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
\`\`\`

## The _app.js File

The \`_app.js\` file is a special file in Next.js that allows you to customize the default App component. It's used to:

- Persist layouts between page changes
- Keep state when navigating pages
- Add global styles
- Handle custom error handling

Here's a basic example:

\`\`\`javascript
// pages/_app.js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
\`\`\`

## Summary

You've learned how to create pages in Next.js using its file-based routing system. You now know how to:

- Create basic pages
- Create nested routes
- Implement dynamic routes
- Customize the 404 page
- Use the \`_app.js\` file for global configurations

In the next section, we'll learn how to link between pages in Next.js.

[Next: Linking Between Pages →](./4-linking-between-pages.md)`;

const file4Content = `# 4. Linking Between Pages

Next.js provides a built-in \`Link\` component for client-side navigation between pages. This component enables faster page transitions without a full page refresh, resulting in a smoother user experience.

## Using the Link Component

The \`Link\` component is imported from \`next/link\` and wraps around your HTML elements or components:

### Example: Basic Link Usage

\`\`\`javascript
// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/about">
        <a>About Us</a>
      </Link>
    </div>
  );
}
\`\`\`

In Next.js 13 and later, the \`Link\` component automatically renders its children as a clickable link, so you don't need to wrap them in an \`<a>\` tag:

\`\`\`javascript
// pages/index.js (Next.js 13+)
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/about">About Us</Link>
    </div>
  );
}
\`\`\`

## Linking to Dynamic Routes

When linking to dynamic routes, you can pass the dynamic parameters in the \`href\` prop:

\`\`\`javascript
// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        <li>
          <Link href="/blog/1">Post 1</Link>
        </li>
        <li>
          <Link href="/blog/2">Post 2</Link>
        </li>
      </ul>
    </div>
  );
}
\`\`\`

For more complex URLs, you can use an object with \`pathname\` and \`query\` properties:

\`\`\`javascript
<Link
  href={{
    pathname: '/blog/[id]',
    query: { id: 'hello-world' },
  }}
>
  <a>Hello World Post</a>
</Link>
\`\`\`

## Navigation Programmatically

Sometimes you need to navigate programmatically, such as after form submission or based on certain conditions. You can use the \`useRouter\` hook from \`next/router\` for this purpose:

\`\`\`javascript
// pages/login.js
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Perform login logic here
    const success = await performLogin(username, password);
    
    if (success) {
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Login</button>
    </form>
  );
}
\`\`\`

## Advanced Link Features

### 1. Shallow Routing

Shallow routing allows you to change the URL without running data fetching methods (like \`getServerSideProps\` or \`getStaticProps\`):

\`\`\`javascript
router.push('/dashboard?page=2', undefined, { shallow: true });
\`\`\`

### 2. Prefetching

Next.js automatically prefetches links that appear in the viewport, improving performance. You can disable this behavior if needed:

\`\`\`javascript
<Link href="/about" prefetch={false}>
  About Us
</Link>
\`\`\`

### 3. Replacing Instead of Pushing

By default, \`Link\` and \`router.push()\` add a new entry to the browser's history stack. If you want to replace the current URL instead, use the \`replace\` prop:

\`\`\`javascript
<Link href="/about" replace>
  About Us
</Link>
\`\`\`

Or with the router:

\`\`\`javascript
router.replace('/about');
\`\`\`

## Summary

You've learned how to navigate between pages in Next.js using:

- The \`Link\` component for declarative navigation
- The \`useRouter\` hook for programmatic navigation
- Advanced features like shallow routing and prefetching

These navigation techniques help create a smooth, app-like experience for your users while maintaining the benefits of a multi-page application.

In the next section, we'll learn how to add static assets to your Next.js application.

[Next: Adding Static Assets →](./5-adding-static-assets.md)`;

const file5Content = `# 5. Adding Static Assets

Next.js makes it easy to include static assets like images, fonts, and other files in your application. These assets are served from the \`public\` directory at the root of your project.

## The Public Directory

Any file placed in the \`public\` directory can be accessed at the root of your application:

\`\`\`
my-next-app/
├── public/
│   ├── images/
│   │   └── logo.png
│   ├── favicon.ico
│   └── robots.txt
└── ...
\`\`\`

## Adding and Using Images

### Basic Image Usage

You can reference images from the \`public\` directory in your components:

\`\`\`javascript
// pages/index.js
export default function Home() {
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <img src="/images/logo.png" alt="Logo" width={200} height={100} />
    </div>
  );
}
\`\`\`

### Using the Image Component

Next.js provides an optimized \`Image\` component that automatically handles:

- Responsive sizes
- Lazy loading
- Image optimization
- WebP format conversion (when supported by the browser)

To use the \`Image\` component:

\`\`\`javascript
// pages/index.js
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={200}
        height={100}
        priority
      />
    </div>
  );
}
\`\`\`

The \`priority\` attribute is used for images that should be preloaded, such as those visible above the fold.

### Using External Images

To use external images with the \`Image\` component, you need to configure the domains in \`next.config.js\`:

\`\`\`javascript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
  },
}
\`\`\`

Then you can use external images:

\`\`\`javascript
<Image
  src="https://example.com/images/logo.png"
  alt="External Logo"
  width={200}
  height={100}
/>
\`\`\`

## Adding Fonts

### Local Fonts

1. Add font files to the \`public/fonts\` directory.
2. Create a CSS file to define the font faces:

\`\`\`css
/* styles/fonts.css */
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/MyCustomFont.woff2') format('woff2'),
       url('/fonts/MyCustomFont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
\`\`\`

3. Import the CSS file in your \`_app.js\`:

\`\`\`javascript
// pages/_app.js
import '../styles/fonts.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
\`\`\`

4. Use the font in your CSS:

\`\`\`css
/* styles/globals.css */
body {
  font-family: 'MyCustomFont', sans-serif;
}
\`\`\`

### Using Google Fonts

Next.js 13 introduced a new Fonts API for easy integration with Google Fonts:

\`\`\`javascript
// pages/_app.js
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
\`\`\`

## Adding Other Static Files

You can add any other static files to the \`public\` directory:

- \`favicon.ico\`: Automatically served at the root
- \`robots.txt\`: For search engine crawlers
- \`sitemap.xml\`: For SEO
- JSON data files
- PDF documents
- Audio and video files

Access these files directly from the root URL:

\`\`\`javascript
<a href="/resume.pdf" download>Download Resume</a>
\`\`\`

## Organizing Static Assets

For larger projects, it's good practice to organize your static assets into subdirectories:

\`\`\`
public/
├── images/
│   ├── logo.png
│   └── hero.jpg
├── fonts/
│   ├── CustomFont.woff2
│   └── CustomFont.woff
├── documents/
│   └── brochure.pdf
└── favicon.ico
\`\`\`

## Summary

You've learned how to:

- Add static assets to the \`public\` directory
- Use the optimized \`Image\` component
- Add and use custom fonts
- Organize static assets for better maintainability

In the next section, we'll explore server-side rendering and static site generation in Next.js.

[Next: Server-Side Rendering and Static Site Generation →](./6-ssr-and-ssg.md)`;

const file6Content = `# 6. Server-Side Rendering and Static Site Generation

Next.js provides two powerful rendering methods: **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)**. These methods help optimize performance, improve SEO, and enhance user experience.

## Understanding Rendering Methods

### Client-Side Rendering (CSR)

In traditional React applications, rendering happens entirely in the browser:

1. Browser loads a minimal HTML shell
2. JavaScript loads and executes
3. React renders the UI
4. Data is fetched and the page updates

**Pros**: Interactive quickly after JavaScript loads
**Cons**: Poor SEO, slower initial load, potential content flashing

### Server-Side Rendering (SSR)

With SSR, the HTML is generated on the server for each request:

1. Server receives a request
2. Server fetches data and renders HTML
3. Browser receives complete HTML
4. JavaScript loads and hydrates the page

**Pros**: Better SEO, faster first contentful paint, good for dynamic data
**Cons**: Slower Time to Interactive, higher server load

### Static Site Generation (SSG)

With SSG, HTML is generated at build time:

1. Pages are pre-rendered during build
2. HTML files are stored and reused for all users
3. Browser receives complete HTML
4. JavaScript loads and hydrates the page

**Pros**: Extremely fast, can be served from CDN, best SEO
**Cons**: Not suitable for highly dynamic content, requires rebuild for updates

## Implementing SSG with getStaticProps

Use \`getStaticProps\` to fetch data at build time:

\`\`\`javascript
// pages/blog.js
export default function Blog({ posts }) {
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

// This function runs at build time
export async function getStaticProps() {
  // Fetch data from an API
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  // Pass data to the page via props
  return {
    props: {
      posts,
    },
    // Re-generate the page at most once per 10 seconds
    // if a request comes in (Incremental Static Regeneration)
    revalidate: 10,
  };
}
\`\`\`

## Dynamic Routes with getStaticPaths

For dynamic routes using SSG, you need to specify which paths to pre-render:

\`\`\`javascript
// pages/blog/[id].js
export default function Post({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

// Specify which paths to pre-render
export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  // Generate paths for each post
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    // fallback: false means pages not returned by getStaticPaths will 404
    // fallback: true means pages not generated at build time will be generated on demand
    // fallback: 'blocking' is similar to true but without the initial loading state
    fallback: false,
  };
}

\`\`\`typescript
// Fetch data for each page
export async function getStaticProps({ params }: { params: { id: string } }) {
  const res = await fetch('https://api.example.com/posts/' + params.id);
  const post = await res.json();

  return {
    props: { post },
    revalidate: 60 // Revalidate every minute
  };
}
\`\`\`
\`\`\`

## Implementing SSR with getServerSideProps

Use \`getServerSideProps\` to fetch data on each request:

\`\`\`javascript
// pages/dashboard.js
export default function Dashboard({ user, data }) {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Here's your personalized dashboard</p>
      {/* Display dashboard data */}
    </div>
  );
}

// This function runs on every request
export async function getServerSideProps(context) {
  // You can access request parameters, headers, cookies, etc.
  const { req, res, params, query } = context;
  
  // Get the user from a cookie or session
  const user = getUserFromCookie(req);
  
  // Fetch personalized data
  const data = await fetchDashboardData(user.id);

  // Pass data to the page via props
  return {
    props: {
      user,
      data,
    },
  };
}
\`\`\`

## Incremental Static Regeneration (ISR)

ISR allows you to update static pages after they've been built without rebuilding the entire site:

\`\`\`typescript
// pages/products/[id].js
export async function getStaticProps({ params }: { params: { id: string } }) {
  const res = await fetch('https://api.example.com/products/' + params.id);
  const product = await res.json();

  return {
    props: { product },
    revalidate: 60 // Revalidate at most every 60 seconds
  };
}
\`\`\`
\`\`\`

## Choosing the Right Rendering Method

| Content Type | Recommended Method | Why? |
|--------------|-------------------|------|
| Blog posts, documentation | SSG | Content doesn't change often |
| Product pages (e-commerce) | SSG + ISR | Content changes occasionally |
| User dashboard | SSR | Content is personalized and frequently updated |
| Search results | SSR or CSR | Content depends on user input |

## Summary

You've learned about:

- Different rendering methods in Next.js
- Implementing Static Site Generation with \`getStaticProps\`
- Handling dynamic routes with \`getStaticPaths\`
- Server-Side Rendering with \`getServerSideProps\`
- Incremental Static Regeneration for updating static content

In the next section, we'll explore how to create API routes in Next.js.

[Next: Creating API Routes →](./7-creating-api-routes.md)`;

const file7Content = `# 7. Creating API Routes

Next.js allows you to create API endpoints as serverless functions within your application. These API routes are defined in the \`pages/api\` directory and can be used to handle form submissions, database interactions, authentication, and more.

## Basic API Route

To create an API route, add a file to the \`pages/api\` directory:

\`\`\`javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello, API!' });
}
\`\`\`

This API can be accessed at \`/api/hello\` and will return a JSON response.

## Request and Response Objects

The API handler function receives two parameters:

- \`req\`: An extended version of Node.js's [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object
- \`res\`: An extended version of Node.js's [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) object

### Common Request Properties and Methods

\`\`\`javascript
// req.method: HTTP method (GET, POST, etc.)
// req.body: Request body (parsed by Next.js)
// req.query: Query parameters
// req.cookies: Cookies sent with the request
// req.headers: Request headers

export default function handler(req, res) {
  const { name } = req.query;
  const { data } = req.body;
  
  console.log(\`Method: \${req.method}\`);
  console.log(\`Query: \${JSON.stringify(req.query)}\`);
  console.log(\`Body: \${JSON.stringify(req.body)}\`);
  
  // Process the request...
}
\`\`\`

### Common Response Methods

\`\`\`javascript
// res.status(code): Set the status code
// res.json(data): Send a JSON response
// res.send(body): Send a response
// res.redirect(url): Redirect to another URL
// res.setHeader(name, value): Set a response header

export default function handler(req, res) {
  res.status(200).json({ success: true, data: 'Some data' });
  
  // Or send an error
  // res.status(400).json({ success: false, error: 'Bad request' });
}
\`\`\`

## Handling Different HTTP Methods

You can handle different HTTP methods in the same API route:

\`\`\`javascript
// pages/api/users.js
export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      // Handle GET request
      return res.status(200).json({ users: ['John', 'Jane'] });
    case 'POST':
      // Handle POST request
      const { name } = req.body;
      return res.status(201).json({ message: \`User \${name} created\` });
    case 'PUT':
      // Handle PUT request
      return res.status(200).json({ message: 'User updated' });
    case 'DELETE':
      // Handle DELETE request
      return res.status(200).json({ message: 'User deleted' });
    default:
      // Method not allowed
      return res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
\`\`\`

## Dynamic API Routes

Similar to pages, API routes can be dynamic:

\`\`\`javascript
// pages/api/users/[id].js
export default function handler(req, res) {
  const { id } = req.query;
  
  switch (req.method) {
    case 'GET':
      // Get user by ID
      return res.status(200).json({ id, name: \`User \${id}\` });
    case 'PUT':
      // Update user by ID
      return res.status(200).json({ id, message: \`User \${id} updated\` });
    case 'DELETE':
      // Delete user by ID
      return res.status(200).json({ id, message: \`User \${id} deleted\` });
    default:
      return res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
\`\`\`

## API Middleware

You can create middleware to handle common functionality across multiple API routes:

\`\`\`javascript
// middleware/withAuth.js
export function withAuth(handler) {
  return async (req, res) => {
    // Check for authentication token
    const token = req.headers.authorization;
    
    if (!token || !isValidToken(token)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // If authenticated, proceed to the handler
    return handler(req, res);
  };
}

// Usage in an API route
// pages/api/protected.js
import { withAuth } from '../../middleware/withAuth';

function protectedHandler(req, res) {
  res.status(200).json({ message: 'This is protected data' });
}

export default withAuth(protectedHandler);
\`\`\`

## Connecting to a Database

API routes are perfect for interacting with databases:

\`\`\`javascript
// lib/db.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve the value
  // across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// pages/api/users/index.js
import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('myDatabase');
  
  switch (req.method) {
    case 'GET':
      const users = await db.collection('users').find({}).toArray();
      return res.status(200).json(users);
    case 'POST':
      const result = await db.collection('users').insertOne(req.body);
      return res.status(201).json(result);
    default:
      return res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
\`\`\`

## Error Handling

Proper error handling is important in API routes:

\`\`\`javascript
// pages/api/example.js
export default async function handler(req, res) {
  try {
    // Potentially risky operation
    const data = await fetchSomeData();
    
    // Success response
    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    
    // Determine the appropriate status code
    const statusCode = error.statusCode || 500;
    
    // Send error response
    res.status(statusCode).json({
      error: true,
      message: error.message || 'An unexpected error occurred',
    });
  }
}
\`\`\`

## CORS Configuration

If your API needs to be accessed from different domains, you can configure CORS:

\`\`\`javascript
// pages/api/cors-example.js
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: ['https://allowed-domain.com', 'https://another-domain.com'],
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors);
  
  // Rest of your API logic
  res.status(200).json({ message: 'CORS enabled API' });
}
\`\`\`

## Summary

You've learned how to:

- Create basic API routes in Next.js
- Handle different HTTP methods
- Create dynamic API routes
- Implement middleware for authentication and other common tasks
- Connect to databases
- Handle errors properly
- Configure CORS for cross-origin requests

API routes make Next.js a powerful full-stack framework, allowing you to build both the frontend and backend of your application in one codebase.

In the next section, we'll explore how to deploy your Next.js application.

[Next: Deploying Your Next.js App →](./8-deploying-nextjs-app.md)`;

const file8Content = `# 8. Deploying Your Next.js App

Once you've built your Next.js application, it's time to deploy it to make it accessible to users. Next.js applications can be deployed to various platforms, with Vercel (created by the team behind Next.js) offering the most seamless experience.

## Preparing for Deployment

Before deploying your Next.js app, make sure to:

1. **Test your application**: Run your app locally and test all features
2. **Check environment variables**: Ensure all necessary environment variables are configured
3. **Build your application**: Run \`npm run build\` to create an optimized production build
4. **Add a README**: Document how to run and maintain your application

## Deploying to Vercel

Vercel provides the easiest deployment experience for Next.js applications.

### Steps to Deploy to Vercel:

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Sign up or log in to Vercel** at [vercel.com](https://vercel.com)

3. **Import your repository**:
   - Click "Import Project"
   - Select "Import Git Repository"
   - Choose your repository

4. **Configure your project**:
   - Vercel automatically detects Next.js and sets up the build settings
   - Add any environment variables needed for your application
   - Customize the project name if desired

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

6. **Access your deployed application**:
   - Once deployment is complete, you'll receive a URL (e.g., \`your-app.vercel.app\`)
   - Your application is now live!

### Vercel Features:

- **Automatic HTTPS**: SSL certificates are automatically provisioned
- **CI/CD**: Automatic deployments when you push to your repository
- **Preview Deployments**: Each pull request gets its own preview URL
- **Environment Variables**: Securely store configuration values
- **Custom Domains**: Connect your own domain name
- **Analytics**: Built-in performance and usage analytics
- **Edge Network**: Global CDN for fast delivery worldwide

## Deploying to Netlify

Netlify is another popular platform for deploying Next.js applications.

### Steps to Deploy to Netlify:

1. **Push your code to a Git repository**

2. **Sign up or log in to Netlify** at [netlify.com](https://netlify.com)

3. **Import your repository**:
   - Click "New site from Git"
   - Choose your Git provider
   - Select your repository

4. **Configure your build settings**:
   - Build command: \`npm run build\`
   - Publish directory: \`.next\`
   - Add any required environment variables

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your application

6. **Configure Netlify for Next.js**:
   - Create a \`netlify.toml\` file in your project root:

\`\`\`toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
\`\`\`

7. **Install the Netlify Next.js plugin**:
\`\`\`bash
npm install -D @netlify/plugin-nextjs
\`\`\`

## Deploying to AWS Amplify

AWS Amplify is a set of tools and services for building full-stack applications.

### Steps to Deploy to AWS Amplify:

1. **Push your code to a Git repository**

2. **Sign up or log in to AWS** and navigate to AWS Amplify

3. **Create a new app**:
   - Click "New app" → "Host web app"
   - Connect your repository provider
   - Select your repository

4. **Configure build settings**:
   - Build command: \`npm run build\`
   - Output directory: \`.next\`
   - Add any required environment variables

5. **Deploy**:
   - Click "Save and deploy"
   - Amplify will build and deploy your application

## Deploying to a Custom Server

You can also deploy your Next.js application to your own server:

1. **Build your application**:
\`\`\`bash
npm run build
\`\`\`

2. **Start the production server**:
\`\`\`bash
npm start
\`\`\`

For more control, you can use a process manager like PM2:

\`\`\`bash
# Install PM2
npm install -g pm2

# Start your Next.js application with PM2
pm2 start npm --name "next-app" -- start

# Make sure the app starts on system reboot
pm2 startup
pm2 save
\`\`\`

## Using Docker for Deployment

You can containerize your Next.js application using Docker:

1. **Create a Dockerfile**:

\`\`\`dockerfile
# Use Node.js LTS
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Allow the app to listen on all interfaces
ENV HOSTNAME "0.0.0.0"

# Start the app
CMD ["npm", "start"]
\`\`\`

2. **Build and run the Docker container**:

\`\`\`bash
# Build the Docker image
docker build -t my-next-app .

# Run the container
docker run -p 3000:3000 my-next-app
\`\`\`

## Optimizing for Production

To ensure the best performance in production:

1. **Enable output caching**:
\`\`\`javascript
// next.config.js
module.exports = {
  output: 'standalone',
}
\`\`\`

2. **Implement ISR for dynamic content**:
\`\`\`javascript
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 60, // Revalidate every 60 seconds
  }
}
\`\`\`

3. **Use a CDN** for static assets and API caching

4. **Monitor performance** using tools like Lighthouse or Vercel Analytics

## Summary

You've learned how to:

- Prepare your Next.js application for deployment
- Deploy to Vercel, the platform created by the Next.js team
- Deploy to alternative platforms like Netlify and AWS Amplify
- Set up deployment on a custom server
- Containerize your application with Docker
- Optimize your application for production

Congratulations! You've completed the Next.js tutorial. You now have the knowledge to build and deploy modern, high-performance web applications using Next.js.

## Next Steps

To continue your Next.js journey:

1. Explore advanced features like middleware, internationalization, and image optimization
2. Learn about state management with libraries like Redux or Zustand
3. Implement authentication using NextAuth.js
4. Integrate a headless CMS for content management
5. Build a full-stack application with a database like MongoDB, PostgreSQL, or Prisma

Happy coding!`;

const file3_1Content = `# 3.1 What is Next.js? Motivation & Use Cases

---

## Learning Objectives
- Understand why Next.js is popular for modern web development
- Compare Client-Side Rendering (CSR) vs Server-Side Rendering (SSR) and Static Site Generation (SSG)
- Identify real-world use cases for Next.js

---

## 1. Introduction to Next.js

**Next.js** is a powerful React framework that enables you to build fast, scalable, and SEO-friendly web applications. It adds features like server-side rendering, static site generation, API routes, and more, all with minimal configuration.

### Why use Next.js?
- **Performance**: Faster page loads with SSR/SSG
- **SEO**: Pages are indexed better by search engines
- **Developer Experience**: Simple setup, hot reloading, and built-in routing
- **Fullstack Capabilities**: Build both frontend and backend (API routes) in one codebase

---

## 2. Rendering Strategies: CSR vs SSR vs SSG

| Rendering Type | Where Rendered? | When Rendered? | Example Use Case |
|---------------|-----------------|----------------|------------------|
| CSR (Client-Side Rendering) | Browser | On every visit | Dashboards, SPAs |
| SSR (Server-Side Rendering) | Server  | On every request | Blogs, News Sites |
| SSG (Static Site Generation) | Build time | Pre-built | Marketing, Docs |

### Visual Diagram
\`\`\`
[User] ⇄ [Server (SSR/SSG)] ⇄ [Browser (CSR)]
\`\`\`

- **CSR**: React app loads in the browser, fetches data after initial load
- **SSR**: Server renders HTML for each request, then hydrates with React
- **SSG**: Static HTML generated at build time, served instantly

---

## 3. When Should You Use Next.js?
- You want fast, SEO-friendly pages
- You need both frontend and backend logic in one place
- You want to use React but need more than just client-side rendering

**Real-World Examples:**
- E-commerce stores (fast product pages, SEO)
- Blogs and documentation sites
- Company websites and portfolios
- SaaS dashboards with authentication

---

## 4. Project Activity: Start Your Portfolio!

> **Goal:** Think about what you want to showcase in your portfolio (projects, skills, contact info). Sketch a simple layout on paper or a tool like Figma.

- What sections will your portfolio have?
- What information do you want to highlight?

In the next session, you will learn about the features of Next.js that will help you bring your portfolio to life!

---

## 5. Summary
- Next.js is a React framework for building modern web apps
- It supports CSR, SSR, and SSG for flexible rendering
- Ideal for SEO, performance, and fullstack development

---

## 6. Questions & Tasks

1. **What are the differences between CSR, SSR, and SSG in Next.js? Provide one use case for each.**  
2. **How does Next.js improve SEO compared to a standard React SPA?**  
3. **List three real-world scenarios where Next.js fullstack capabilities shine.**  

**Task:**  
\`\`\`tsx
// Initialize a new Next.js TypeScript project and create an \`about\` page:
// 1. CLI: npx create-next-app@latest my-portfolio --typescript
// 2. Create file: pages/about.tsx
import { GetStaticProps, NextPage } from 'next';

interface AboutProps { description: string; }

const About: NextPage<AboutProps> = ({ description }) => <p>{description}</p>;

export const getStaticProps: GetStaticProps<AboutProps> = async () => ({ props: { description: 'Welcome to my portfolio!' } });

export default About;
\`\`\`
`;

const file3_2Content = `# 3.2 Key Features & Benefits of Next.js

---

## Learning Objectives
- Identify the core features that make Next.js powerful
- Understand SSR, SSG, and automatic code splitting
- Get introduced to API routes and developer experience benefits
- See how these features help you build your Student Project Portfolio

---

## 1. Server-Side Rendering (SSR)
- **What is SSR?**
  - Pages are rendered on the server for each request, then sent to the client.
  - Great for SEO and initial load performance.
- **How Next.js makes SSR easy:**
  - Just export an \`async function getServerSideProps()\` in your page component.
- **Example Use Case:**
  - Your portfolio homepage fetches and displays your latest projects from a database, always showing up-to-date info.

---

## 2. Static Site Generation (SSG)
- **What is SSG?**
  - Pages are pre-rendered at build time (not on every request).
  - Super fast, ideal for content that doesn’t change often (e.g., About page).
- **How Next.js makes SSG easy:**
  - Export \`async function getStaticProps()\` (and optionally \`getStaticPaths()\` for dynamic routes).
- **Example Use Case:**
  - Your portfolio’s About page or static project details.

---

## 3. Automatic Code Splitting
- **What is it?**
  - Only the code needed for the current page is loaded, making your app fast.
- **How Next.js helps:**
  - Each page in the \`pages\` directory is automatically code-split.
- **Benefit:**
  - Faster load times for your users.

---

## 4. API Routes (Intro)
- **What are API routes?**
  - Build backend endpoints (like \`/api/projects\`) right inside your Next.js app.
  - No need for a separate backend server for simple APIs.
- **Example Use Case:**
  - Add a contact form to your portfolio that sends emails using an API route.

---

## 5. Developer Experience (DX) Benefits
- **Fast Refresh:** See code changes instantly in the browser.
- **Zero Config:** Sensible defaults, but highly configurable.
- **Built-in Routing:** File-based routing—just add a file to \`pages/\`.
- **TypeScript Support:** First-class TypeScript integration.

---

## 6. Rendering Strategies in Next.js
- \`getStaticProps\`: For SSG
- \`getServerSideProps\`: For SSR
- **Client-side Fetching**: For highly dynamic data (e.g., user dashboards)

| Method                | When Runs         | Use Case                  |
|-----------------------|-------------------|---------------------------|
| \`getStaticProps\`      | At build time     | Static content, fast load |
| \`getServerSideProps\`  | On each request   | Always up-to-date data    |
| Client-side Fetching  | In the browser    | User-specific data        |

---

## 7. Activity: Explore Next.js Features
- Visit the [Next.js Examples Gallery](https://nextjs.org/examples) and find a project similar to your portfolio idea.
- List 2–3 features you’d like to use in your own project (e.g., SSR for homepage, SSG for About, API route for contact form).

---

## 8. Summary
- Next.js offers SSR, SSG, API routes, and automatic code splitting out of the box
- These features help you build fast, scalable, and SEO-friendly apps
- Next, you’ll set up your own Next.js project with TypeScript!

---

## 9. Questions & Tasks

1. **Explain how automatic code splitting works in Next.js and why it’s beneficial.**  
2. **Compare \`getStaticProps\` and \`getServerSideProps\`: when would you choose each?**  
3. **List three Developer Experience features in Next.js and how they improve development.**  

**Task:**  
\`\`\`tsx
// pages/api/hello.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello Next.js' });
}

// pages/index.tsx
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [msg, setMsg] = useState<string>('');
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(console.error);
  }, []);

  return <div>{msg || 'Loading...'}</div>;
};

export default Home;
\`\`\`
`;

const file3_3Content = `# 3.3 Setting up Next.js with TypeScript & Project Structure

---

## Learning Objectives
- Set up a new Next.js project with TypeScript
- Understand the project structure and key files
- Run and explore the development server

---

## 1. Creating a Next.js + TypeScript Project

> **Project Step:**
> You’ll now create the foundation of your Student Project Portfolio app!

### Step-by-Step Guide
1. **Open your terminal** and navigate to your projects folder.
2. **Run the following command:**
   \`\`\`bash
   npx create-next-app@latest student-portfolio --typescript
   \`\`\`
   - This creates a new folder called \`student-portfolio\` with TypeScript support.
3. **Navigate into your project:**
   \`\`\`bash
   cd student-portfolio
   \`\`\`
4. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 2. Understanding the Project Structure

\`\`\`
student-portfolio/
├── node_modules/
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   └── ...
├── public/
├── styles/
│   └── globals.css
├── tsconfig.json
├── next.config.js
├── package.json
└── ...
\`\`\`

- **pages/**: Each file is a route. \`index.tsx\` is the homepage.
- **public/**: Static assets (images, favicon, etc.)
- **styles/**: Global and modular CSS files.
- **tsconfig.json**: TypeScript configuration.
- **next.config.js**: Next.js configuration.

---

## 3. Key Files Explained
- \`_app.tsx\`: Customizes the root React component for all pages (good place for global styles, layouts).
- \`_document.tsx\`: (Optional) Customizes the HTML document structure (advanced use).
- \`next.config.js\`: Configure advanced Next.js features.
- \`tsconfig.json\`: Controls TypeScript behavior and strictness.

---

## 4. Activity: Explore Your Project
- Open your new project in VS Code or your favorite editor.
- Look at the files and folders mentioned above.
- Try editing \`pages/index.tsx\` and see your changes update live in the browser.

---

## 5. Summary
- You’ve set up a Next.js project with TypeScript
- You understand the basic structure and key files
- Next, you’ll create your first pages and start customizing your portfolio!

---

## 6. Questions & Tasks

1. **List the key directories and files created by \`create-next-app --typescript\`, and explain their purpose.**  
2. **What are two important options in \`tsconfig.json\`, and how do they affect TypeScript compilation?**  
3. **How do you start the Next.js development server, and at what URL do you access it?**  

**Task:**  
\`\`\`bash
npx create-next-app@latest demo-app --typescript
cd demo-app
npm run dev

# Then:
# 1. Open tsconfig.json and set "strict": true
# 2. Create a new page at pages/test.tsx with a simple React.FC component
# 3. Visit http://localhost:3000/test to verify it renders.
\`\`\`
`;

const file3_4Content = `# 3.4 Basic Page Creation & Configuration with TypeScript

---

## Learning Objectives
- Create and type your first pages in Next.js
- Understand file-based routing
- Add basic global styling
- Run and view your pages in the browser

---

## 1. Creating Your First Page

In Next.js, every file in the \`pages/\` directory automatically becomes a route!

### Example: Creating \`index.tsx\` (Homepage)
\`\`\`tsx
// pages/index.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <main>
      <h1>Welcome to My Student Portfolio</h1>
      <p>This is the homepage of your project-based portfolio app.</p>
    </main>
  );
};

export default Home;
\`\`\`

- Save the file. Visit [http://localhost:3000](http://localhost:3000) to see your homepage!

---

## 2. Adding an About Page

Create a new file: \`pages/about.tsx\`

\`\`\`tsx
// pages/about.tsx
import React from 'react';

const About: React.FC = () => (
  <main>
    <h1>About Me</h1>
    <p>Write a short introduction about yourself here.</p>
  </main>
);

export default About;
\`\`\`

Visit [http://localhost:3000/about](http://localhost:3000/about) to see your About page.

---

## 3. Type-Safe Routing
- File names in \`pages/\` become routes automatically (e.g., \`about.tsx\` → \`/about\`).
- Use TypeScript (\`.tsx\` files) for type safety and better developer experience.

---

## 4. Basic Styling: Global CSS
- By default, Next.js includes a global CSS file: \`styles/globals.css\`.
- You can import it in \`pages/_app.tsx\`:

\`\`\`tsx
// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
\`\`\`

---

## 5. Activity: Customize Your Pages
- Edit your homepage and about page to include your name, a profile picture, or your favorite colors.
- Try adding a new page (e.g., \`pages/projects.tsx\`) to list your projects.

---

## 6. Summary
- You created and typed your first pages in Next.js
- Learned about file-based routing and global CSS
- Your portfolio app is now live with multiple pages!

---

## 6. Questions & Tasks

1. **How do you create a typed Next.js page? List the steps and file naming conventions.**  
2. **Why must you use \`.tsx\` for Next.js pages when using TypeScript?**  
3. **Explain how and where to apply global CSS vs. component-level styles.**  

**Task:**  
\`\`\`tsx
// Create a new page at pages/projects.tsx
// 1. Export a React.FC component that displays an array of project names.
// 2. Use TypeScript types/interfaces for props if needed.
// 3. Run \`npm run dev\` and verify \`/projects\` renders correctly.
\`\`\`

[Back to Week 03 Overview](./README.md)`;


// Mapping file names to their content
const fileContentsMap: { [key: string]: string } = {
  'README.md': readmeContent,
  '1-what-is-nextjs.md': file1Content,
  '2-setting-up-nextjs-project.md': file2Content,
  '3-creating-pages.md': file3Content,
  '4-linking-between-pages.md': file4Content,
  '5-adding-static-assets.md': file5Content,
  '6-ssr-and-ssg.md': file6Content,
  '7-creating-api-routes.md': file7Content,
  '8-deploying-nextjs-app.md': file8Content,
  '3.1-nextjs-intro-motivation.md': file3_1Content,
  '3.2-nextjs-features-benefits.md': file3_2Content,
  '3.3-nextjs-setup-typescript.md': file3_3Content,
  '3.4-nextjs-basic-pages.md': file3_4Content,
};

// Order of topics (manually adjusted for logical flow and to include all files)
const orderedFileNames = [
  'README.md',                      // Overall introduction
  '1-what-is-nextjs.md',            // General introduction to Next.js
  '2-setting-up-nextjs-project.md', // Basic project setup
  '3.3-nextjs-setup-typescript.md', // Detailed setup with TypeScript
  '3-creating-pages.md',            // General page creation & routing
  '3.4-nextjs-basic-pages.md',      // Basic page creation with TypeScript focus
  '4-linking-between-pages.md',
  '5-adding-static-assets.md',
  '6-ssr-and-ssg.md',
  '7-creating-api-routes.md',
  '8-deploying-nextjs-app.md',
  '3.1-nextjs-intro-motivation.md', // More lesson-like overview (could be supplementary)
  '3.2-nextjs-features-benefits.md',// More lesson-like features (could be supplementary)
];

// Process all topics
export const TOPICS_DATA: Topic[] = orderedFileNames.map(fileName => {
  const content = fileContentsMap[fileName];
  const topic = processMarkdownFile(fileName, content);

  // Custom adjustments for quizzes/exercises based on specific content from 3.x files
  if (topic.id === 'intro-motivation' && topic.quiz.question) {
    topic.quiz.question = "What are the key differences between Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG) in Next.js?";
    topic.quiz.options = generateQuizOptions("CSR renders in browser, SSR on server per request, SSG at build time.", topic.title);
    topic.quiz.correctAnswerId = topic.quiz.options.find(opt => opt.text.includes("CSR renders in browser"))?.id || "a";
    topic.quiz.explanation = "CSR renders entirely in the client's browser, SSR renders on the server for each request, and SSG pre-renders HTML at build time. They differ in when and where content is generated, impacting performance, SEO, and data freshness.";
  }
  if (topic.id === 'features-benefits' && topic.quiz.question) {
    topic.quiz.question = "How does automatic code splitting benefit a Next.js application?";
    topic.quiz.options = generateQuizOptions("It loads only the code necessary for the current page, reducing initial load times.", topic.title);
    topic.quiz.correctAnswerId = topic.quiz.options.find(opt => opt.text.includes("It loads only the code necessary"))?.id || "a";
    topic.quiz.explanation = "Automatic code splitting ensures that only the JavaScript and CSS required for a specific page are loaded, improving performance by reducing the amount of data transferred and processed during initial page load.";
  }
  if (topic.id === 'setup-typescript' && topic.quiz.question) {
    topic.quiz.question = "Which of the following files is primarily responsible for configuring TypeScript in a Next.js project?";
    topic.quiz.options = [
      { id: "a", text: "package.json" },
      { id: "b", text: "tsconfig.json" },
      { id: "c", text: "next.config.js" },
      { id: "d", text: "globals.css" }
    ];
    topic.quiz.correctAnswerId = "b";
    topic.quiz.explanation = "`tsconfig.json` is the configuration file for TypeScript, where you can set compiler options, include/exclude files, and define strictness rules.";
  }
  if (topic.id === 'basic-pages' && topic.quiz.question) {
    topic.quiz.question = "What is the primary method Next.js uses for routing pages?";
    topic.quiz.options = [
      { id: "a", text: "URL-based routing configured in a central router file." },
      { id: "b", text: "File-system based routing, where files in `pages/` become routes." },
      { id: "c", text: "Routing managed exclusively by React Router DOM." },
      { id: "d", text: "Routes are generated dynamically through API calls." }
    ];
    topic.quiz.correctAnswerId = "b";
    topic.quiz.explanation = "Next.js uses a file-system based router. Any `.js`, `.jsx`, `.ts`, or `.tsx` file under the `pages` directory automatically becomes a route.";
  }

  return topic;
});

// ===== CUSTOMIZE YOUR APP TITLE HERE =====
export const APP_TITLE = "Next.js Tutorial for Beginners";

// ===== TUTORIAL CONTENT =====
// Modify the topics array below to create your own tutorial content
// Each topic follows the structure defined in the Topic interface (see types.ts)