# 2. Setting Up Your Next.js Project

Before we start coding, ensure that you have Node.js and npm installed on your computer. If you don't have them, you can download and install them from [nodejs.org](https://nodejs.org/).

## Creating a New Next.js Project

Next.js provides a simple way to create a new project with all the necessary configuration:

1. **Install Next.js** using the following command:

   ```bash
   npx create-next-app@latest my-next-app
   ```

   This will create a new folder called `my-next-app` with all the necessary files.

2. **Navigate to your project directory:**

   ```bash
   cd my-next-app
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. Open your browser and go to [http://localhost:3000](http://localhost:3000). You should see the default Next.js welcome page.

## Understanding the Project Structure

After creating a new Next.js project, you'll see the following directory structure:

```
my-next-app/
├── node_modules/
├── public/          # Static files (images, fonts, etc.)
├── pages/           # Pages and API routes
│   ├── api/         # API endpoints
│   ├── _app.tsx      # Custom App component
│   └── index.tsx     # Home page
├── styles/          # CSS files
├── .eslintrc.json   # ESLint configuration
├── .gitignore       # Git ignore file
├── next.config.ts   # Next.js configuration
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

### Key Directories and Files:

- **pages/**: Contains all your pages and API routes. Each file becomes a route based on its name.
- **public/**: Stores static assets like images, fonts, and other files.
- **styles/**: Contains CSS files for styling your application.
- **next.config.js**: Configuration file for customizing Next.js.
- **package.json**: Lists project dependencies and scripts.

## Configuration Options

Next.js is designed to work out of the box with minimal configuration, but you can customize it using the `next.config.ts` file:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,  // Enable React strict mode
  images: {
    domains: ['example.com'],  // Allow images from this domain
  },
  // Other configuration options
};

export default config;
```

## Adding TypeScript Support

Next.js has built-in TypeScript support. To use TypeScript in your project:

1. Create a new Next.js project with TypeScript:

   ```bash
   npx create-next-app@latest my-typescript-app --typescript
   ```

   Or add TypeScript to an existing project:

   ```bash
   touch tsconfig.json
   npm install --save-dev typescript @types/react @types/node
   ```

2. Run the development server, and Next.js will automatically configure TypeScript:

   ```bash
   npm run dev
   ```

## Summary

You've now set up a Next.js project and understand its basic structure. In the next section, we'll learn how to create pages in Next.js using its file-based routing system.

[Next: Creating Pages in Next.js →](./3-creating-pages.md)
