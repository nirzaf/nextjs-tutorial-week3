# 6. Server-Side Rendering and Static Site Generation

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

Use `getStaticProps` to fetch data at build time:

```typescript
// pages/blog.tsx
import React from 'react';
import { GetStaticProps } from 'next';

type Post = {
  id: string;
  title: string;
};

type BlogProps = {
  posts: Post[];
};

const Blog: React.FC<BlogProps> = ({ posts }) => {
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
};

// This function runs at build time
export const getStaticProps: GetStaticProps<BlogProps> = async () => {
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
};

export default Blog;
```

## Dynamic Routes with getStaticPaths

For dynamic routes using SSG, you need to specify which paths to pre-render:

```typescript
// pages/blog/[id].tsx
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

type Post = {
  id: string;
  title: string;
  content: string;
};

type PostProps = {
  post: Post;
};

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

// Specify which paths to pre-render
export const getStaticPaths: GetStaticPaths = async () => {
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
};

// Fetch data for each page
export const getStaticProps: GetStaticProps<PostProps, { id: string }> = async ({ params }) => {
  const res = await fetch(`https://api.example.com/posts/${params?.id}`);
  const post = await res.json();

  return {
    props: {
      post,
    },
    revalidate: 60, // Revalidate every minute
  };
};

export default Post;
```

## Implementing SSR with getServerSideProps

Use `getServerSideProps` to fetch data on each request:

```typescript
// pages/dashboard.tsx
import React from 'react';
import { GetServerSideProps } from 'next';
import { IncomingMessage } from 'http';

type User = {
  id: string;
  name: string;
};

type DashboardData = {
  // Define your dashboard data structure
  items: any[];
};

type DashboardProps = {
  user: User;
  data: DashboardData;
};

// This would be your actual functions
const getUserFromCookie = (req: IncomingMessage): User => {
  // Implementation details
  return { id: '1', name: 'John Doe' }; // Placeholder
};

const fetchDashboardData = async (userId: string): Promise<DashboardData> => {
  // Implementation details
  return { items: [] }; // Placeholder
};

const Dashboard: React.FC<DashboardProps> = ({ user, data }) => {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Here's your personalized dashboard</p>
      {/* Display dashboard data */}
    </div>
  );
};

// This function runs on every request
export const getServerSideProps: GetServerSideProps<DashboardProps> = async (context) => {
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
};

export default Dashboard;
```

## Incremental Static Regeneration (ISR)

ISR allows you to update static pages after they've been built without rebuilding the entire site:

```typescript
// pages/products/[id].tsx
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type ProductPageProps = {
  product: Product;
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ProductPageProps, { id: string }> = async ({ params }) => {
  const res = await fetch(`https://api.example.com/products/${params?.id}`);
  const product = await res.json();

  return {
    props: {
      product,
    },
    // Regenerate the page:
    // - When a request comes in
    // - At most once every 60 seconds
    revalidate: 60,
  };
}
```

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
- Implementing Static Site Generation with `getStaticProps`
- Handling dynamic routes with `getStaticPaths`
- Server-Side Rendering with `getServerSideProps`
- Incremental Static Regeneration for updating static content

In the next section, we'll explore how to create API routes in Next.js.

[Next: Creating API Routes →](./7-creating-api-routes.md)
