# 8. Deploying Your Next.js App

Once you've built your Next.js application, it's time to deploy it to make it accessible to users. Next.js applications can be deployed to various platforms, with Vercel (created by the team behind Next.js) offering the most seamless experience.

## Preparing for Deployment

Before deploying your Next.js app, make sure to:

1. **Test your application**: Run your app locally and test all features
2. **Check environment variables**: Ensure all necessary environment variables are configured
3. **Build your application**: Run `npm run build` to create an optimized production build
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
   - Once deployment is complete, you'll receive a URL (e.g., `your-app.vercel.app`)
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
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add any required environment variables

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your application

6. **Configure Netlify for Next.js**:
   - Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

7. **Install the Netlify Next.js plugin**:
```bash
npm install -D @netlify/plugin-nextjs
```

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
   - Build command: `npm run build`
   - Output directory: `.next`
   - Add any required environment variables

5. **Deploy**:
   - Click "Save and deploy"
   - Amplify will build and deploy your application

## Deploying to a Custom Server

You can also deploy your Next.js application to your own server:

1. **Build your application**:
```bash
npm run build
```

2. **Start the production server**:
```bash
npm start
```

For more control, you can use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start your Next.js application with PM2
pm2 start npm --name "next-app" -- start

# Make sure the app starts on system reboot
pm2 startup
pm2 save
```

## Using Docker for Deployment

You can containerize your Next.js application using Docker:

1. **Create a Dockerfile**:

```dockerfile
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
```

2. **Build and run the Docker container**:

```bash
# Build the Docker image
docker build -t my-next-app .

# Run the container
docker run -p 3000:3000 my-next-app
```

## Optimizing for Production

To ensure the best performance in production:

1. **Enable output caching**:
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
};

export default config;
```

2. **Implement ISR for dynamic content**:
```typescript
import { GetStaticProps } from 'next';

type PageProps = {
  data: any;
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return {
    props: { data },
    revalidate: 60, // Revalidate every 60 seconds
  }
};
```

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

Happy coding!
