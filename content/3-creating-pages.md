# 3. Creating Pages in Next.js

Next.js uses a **file-based routing system**, which means that every file you create inside the `pages` directory automatically becomes a route in your application. This intuitive approach simplifies the routing process and makes your application structure easy to understand.

## Basic Page Creation

To create a new page in Next.js, simply add a JavaScript or TypeScript file to the `pages` directory:

### Example: Creating an About Page

1. Create a new file called `about.js` in the `pages` directory:

```javascript
// pages/about.js

export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page of our Next.js application.</p>
    </div>
  );
}
```

2. Access your new page by navigating to `http://localhost:3000/about` in your browser.

## Nested Routes

You can create nested routes by adding files to subdirectories within the `pages` directory:

### Example: Creating a Nested Route

1. Create a directory called `blog` inside the `pages` directory.
2. Add a file called `index.js` inside the `blog` directory:

```javascript
// pages/blog/index.js

export default function Blog() {
  return (
    <div>
      <h1>Blog</h1>
      <p>Welcome to our blog!</p>
    </div>
  );
}
```

3. Access this page at `http://localhost:3000/blog`.

4. Create another file called `first-post.js` inside the `blog` directory:

```javascript
// pages/blog/first-post.js

export default function FirstPost() {
  return (
    <div>
      <h1>First Post</h1>
      <p>This is my first blog post!</p>
    </div>
  );
}
```

5. Access this page at `http://localhost:3000/blog/first-post`.

## Dynamic Routes

Next.js supports dynamic routes using brackets `[]` in the filename:

### Example: Creating a Dynamic Route

1. Create a file called `[id].js` inside the `blog` directory:

```javascript
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
```

2. Access this page with different IDs, such as `http://localhost:3000/blog/1` or `http://localhost:3000/blog/hello-world`.

## Custom 404 Page

Next.js allows you to create a custom 404 page by adding a `404.js` file to the `pages` directory:

```javascript
// pages/404.js

export default function Custom404() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
```

## The _app.js File

The `_app.js` file is a special file in Next.js that allows you to customize the default App component. It's used to:

- Persist layouts between page changes
- Keep state when navigating pages
- Add global styles
- Handle custom error handling

Here's a basic example:

```javascript
// pages/_app.js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

## Summary

You've learned how to create pages in Next.js using its file-based routing system. You now know how to:

- Create basic pages
- Create nested routes
- Implement dynamic routes
- Customize the 404 page
- Use the `_app.js` file for global configurations

In the next section, we'll learn how to link between pages in Next.js.

[Next: Linking Between Pages →](./4-linking-between-pages.md)
