# 3. Creating Pages in Next.js

Next.js uses a **file-based routing system**, which means that every file you create inside the `pages` directory automatically becomes a route in your application. This intuitive approach simplifies the routing process and makes your application structure easy to understand.

## Basic Page Creation

To create a new page in Next.js, simply add a TypeScript file to the `pages` directory:

### Example: Creating an About Page

1. Create a new file called `about.tsx` in the `pages` directory:

```typescript
// pages/about.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page of our Next.js application.</p>
    </div>
  );
};

export default About;
```

2. Access your new page by navigating to `http://localhost:3000/about` in your browser.

## Nested Routes

You can create nested routes by adding files to subdirectories within the `pages` directory:

### Example: Creating a Nested Route

1. Create a directory called `blog` inside the `pages` directory.
2. Add a file called `index.tsx` inside the `blog` directory:

```typescript
// pages/blog/index.tsx
import React from 'react';

const Blog: React.FC = () => {
  return (
    <div>
      <h1>Blog</h1>
      <p>Welcome to our blog!</p>
    </div>
  );
};

export default Blog;
```

3. Access this page at `http://localhost:3000/blog`.

4. Create another file called `first-post.tsx` inside the `blog` directory:

```typescript
// pages/blog/first-post.tsx
import React from 'react';

const FirstPost: React.FC = () => {
  return (
    <div>
      <h1>First Post</h1>
      <p>This is my first blog post!</p>
    </div>
  );
};

export default FirstPost;
```

5. Access this page at `http://localhost:3000/blog/first-post`.

## Dynamic Routes

Next.js supports dynamic routes using brackets `[]` in the filename:

### Example: Creating a Dynamic Route

1. Create a file called `[id].tsx` inside the `blog` directory:

```typescript
// pages/blog/[id].tsx
import React from 'react';
import { useRouter } from 'next/router';

const Post: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Post: {id}</h1>
      <p>This is post #{id}</p>
    </div>
  );
};

export default Post;
```

2. Access this page with different IDs, such as `http://localhost:3000/blog/1` or `http://localhost:3000/blog/hello-world`.

## Custom 404 Page

Next.js allows you to create a custom 404 page by adding a `404.tsx` file to the `pages` directory:

```typescript
// pages/404.tsx
import React from 'react';

const Custom404: React.FC = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default Custom404;
```

## The _app.tsx File

The `_app.tsx` file is a special file in Next.js that allows you to customize the default App component. It's used to:

- Persist layouts between page changes
- Keep state when navigating pages
- Add global styles
- Handle custom error handling

Here's a basic example:

```typescript
// pages/_app.tsx
import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
```

## Summary

You've learned how to create pages in Next.js using its file-based routing system. You now know how to:

- Create basic pages
- Create nested routes
- Implement dynamic routes
- Customize the 404 page
- Use the `_app.tsx` file for global configurations

In the next section, we'll learn how to link between pages in Next.js.

[Next: Linking Between Pages →](./4-linking-between-pages.md)
