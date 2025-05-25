# 4. Linking Between Pages

Next.js provides a built-in `Link` component for client-side navigation between pages. This component enables faster page transitions without a full page refresh, resulting in a smoother user experience.

## Using the Link Component

The `Link` component is imported from `next/link` and wraps around your HTML elements or components:

### Example: Basic Link Usage

```typescript
// pages/index.tsx
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/about">
        <a>About Us</a>
      </Link>
    </div>
  );
};

export default Home;
```

In Next.js 13 and later, the `Link` component automatically renders its children as a clickable link, so you don't need to wrap them in an `<a>` tag:

```typescript
// pages/index.tsx (Next.js 13+)
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/about">About Us</Link>
    </div>
  );
};

export default Home;
```

## Linking to Dynamic Routes

When linking to dynamic routes, you can pass the dynamic parameters in the `href` prop:

```typescript
// pages/index.tsx
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
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
};

export default Home;
```

For more complex URLs, you can use an object with `pathname` and `query` properties:

```typescript
<Link
  href={{
    pathname: '/blog/[id]',
    query: { id: 'hello-world' },
  }}
>
  <a>Hello World Post</a>
</Link>
```

## Navigation Programmatically

Sometimes you need to navigate programmatically, such as after form submission or based on certain conditions. You can use the `useRouter` hook from `next/router` for this purpose:

```typescript
// pages/login.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

// Define a type for the login function result
type LoginResult = Promise<boolean>;

// This would be your actual login function
const performLogin = (username: string, password: string): LoginResult => {
  // Implementation details
  return Promise.resolve(true); // Placeholder
};

const Login: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
};

export default Login;
```

## Advanced Link Features

### 1. Shallow Routing

Shallow routing allows you to change the URL without running data fetching methods (like `getServerSideProps` or `getStaticProps`):

```typescript
router.push('/dashboard?page=2', undefined, { shallow: true });
```

### 2. Prefetching

Next.js automatically prefetches links that appear in the viewport, improving performance. You can disable this behavior if needed:

```typescript
<Link href="/about" prefetch={false}>
  About Us
</Link>
```

### 3. Replacing Instead of Pushing

By default, `Link` and `router.push()` add a new entry to the browser's history stack. If you want to replace the current URL instead, use the `replace` prop:

```typescript
<Link href="/about" replace>
  About Us
</Link>
```

Or with the router:

```typescript
router.replace('/about');
```

## Summary

You've learned how to navigate between pages in Next.js using:

- The `Link` component for declarative navigation
- The `useRouter` hook for programmatic navigation
- Advanced features like shallow routing and prefetching

These navigation techniques help create a smooth, app-like experience for your users while maintaining the benefits of a multi-page application.

In the next section, we'll explore how to add static assets to your Next.js application.

[Next: Adding Static Assets →](./5-adding-static-assets.md)
