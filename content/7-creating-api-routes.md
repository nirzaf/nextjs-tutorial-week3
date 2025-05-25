# 7. Creating API Routes

Next.js allows you to create API endpoints as serverless functions within your application. These API routes are defined in the `pages/api` directory and can be used to handle form submissions, database interactions, authentication, and more.

## Basic API Route

To create an API route, add a file to the `pages/api` directory:

```typescript
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello, API!' });
}
```

This API can be accessed at `/api/hello` and will return a JSON response.

## Request and Response Objects

The API handler function receives two parameters:

- `req`: An extended version of Node.js's [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object
- `res`: An extended version of Node.js's [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) object

### Common Request Properties and Methods

```typescript
// req.method: HTTP method (GET, POST, etc.)
// req.body: Request body (parsed by Next.js)
// req.query: Query parameters
// req.cookies: Cookies sent with the request
// req.headers: Request headers

import type { NextApiRequest, NextApiResponse } from 'next';

type RequestData = {
  data: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  const { data } = req.body as RequestData;
  
  console.log(`Method: ${req.method}`);
  console.log(`Query: ${JSON.stringify(req.query)}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  
  // Process the request...
}
```

### Common Response Methods

```typescript
// res.status(code): Set the status code
// res.json(data): Send a JSON response
// res.send(body): Send a response
// res.redirect(url): Redirect to another URL
// res.setHeader(name, value): Set a response header

import type { NextApiRequest, NextApiResponse } from 'next';

type SuccessResponse = {
  success: true;
  data: string;
};

type ErrorResponse = {
  success: false;
  error: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  res.status(200).json({ success: true, data: 'Some data' });
  
  // Or send an error
  // res.status(400).json({ success: false, error: 'Bad request' });
}
```

## Handling Different HTTP Methods

You can handle different HTTP methods in the same API route:

```typescript
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type GetResponse = {
  users: string[];
};

type PostResponse = {
  message: string;
};

type PutResponse = {
  message: string;
};

type DeleteResponse = {
  message: string;
};

type ResponseData = GetResponse | PostResponse | PutResponse | DeleteResponse;

type RequestBody = {
  name?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case 'GET':
      // Handle GET request
      return res.status(200).json({ users: ['John', 'Jane'] });
    case 'POST':
      // Handle POST request
      const { name } = req.body as RequestBody;
      return res.status(201).json({ message: `User ${name} created` });
    case 'PUT':
      // Handle PUT request
      return res.status(200).json({ message: 'User updated' });
    case 'DELETE':
      // Handle DELETE request
      return res.status(200).json({ message: 'User deleted' });
    default:
      // Method not allowed
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## Dynamic API Routes

Similar to pages, API routes can be dynamic:

```typescript
// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';

type UserResponse = {
  id: string;
  name?: string;
  message?: string;
};

type ErrorResponse = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse | ErrorResponse>
) {
  const { id } = req.query;
  
  switch (req.method) {
    case 'GET':
      // Get user by ID
      return res.status(200).json({ id: id as string, name: `User ${id}` });
    case 'PUT':
      // Update user by ID
      return res.status(200).json({ id: id as string, message: `User ${id} updated` });
    case 'DELETE':
      // Delete user by ID
      return res.status(200).json({ id: id as string, message: `User ${id} deleted` });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## API Middleware

You can create middleware to handle common functionality across multiple API routes:

```typescript
// middleware/withAuth.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

// This would be your actual token validation function
const isValidToken = (token: string): boolean => {
  // Implementation details
  return token.startsWith('Bearer '); // Simplified example
};

export function withAuth(handler: ApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
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
// pages/api/protected.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../middleware/withAuth';

type ProtectedData = {
  message: string;
};

function protectedHandler(
  req: NextApiRequest,
  res: NextApiResponse<ProtectedData>
) {
  res.status(200).json({ message: 'This is protected data' });
}

export default withAuth(protectedHandler);
```

## Connecting to a Database

API routes are perfect for interacting with databases:

```typescript
// lib/db.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

// Add global type for the MongoDB client promise
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

const uri = process.env.MONGODB_URI as string;
const options: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

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

// pages/api/users/index.ts
import clientPromise from '../../../lib/db';

import type { NextApiRequest, NextApiResponse } from 'next';

type User = {
  _id?: string;
  name: string;
  email: string;
  // Add other user properties
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db('myDatabase');
  
  switch (req.method) {
    case 'GET':
      const users = await db.collection('users').find({}).toArray();
      return res.status(200).json(users as User[]);
    case 'POST':
      const result = await db.collection('users').insertOne(req.body as User);
      return res.status(201).json(result);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## Error Handling

Proper error handling is important in API routes:

```typescript
// pages/api/example.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  // Define your data structure
  [key: string]: any;
};

type ErrorResponse = {
  error: boolean;
  message: string;
  statusCode: number;
};

// This would be your actual data fetching function
const fetchSomeData = async (): Promise<Data> => {
  // Implementation details
  return { success: true, data: 'Some data' };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  try {
    // Potentially risky operation
    const data = await fetchSomeData();
    
    // Success response
    res.status(200).json(data);
  } catch (error: any) {
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
```

## CORS Configuration

If your API needs to be accessed from different domains, you can configure CORS:

```typescript
// pages/api/cors-example.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: ['https://allowed-domain.com', 'https://another-domain.com'],
});

// Helper function to run middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: Error | unknown) => {
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
```

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

[Next: Deploying Your Next.js App →](./8-deploying-nextjs-app.md)
