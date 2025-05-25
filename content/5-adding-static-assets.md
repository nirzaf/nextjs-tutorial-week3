# 5. Adding Static Assets

Next.js makes it easy to include static assets like images, fonts, and other files in your application. These assets are served from the `public` directory at the root of your project.

## The Public Directory

Any file placed in the `public` directory can be accessed at the root of your application:

```
my-next-app/
├── public/
│   ├── images/
│   │   └── logo.png
│   ├── favicon.ico
│   └── robots.txt
└── ...
```

## Adding and Using Images

### Basic Image Usage

You can reference images from the `public` directory in your components:

```typescript
// pages/index.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <img src="/images/logo.png" alt="Logo" width={200} height={100} />
    </div>
  );
};

export default Home;
```

### Using the Image Component

Next.js provides an optimized `Image` component that automatically handles:

- Responsive sizes
- Lazy loading
- Image optimization
- WebP format conversion (when supported by the browser)

To use the `Image` component:

```typescript
// pages/index.tsx
import React from 'react';
import Image from 'next/image';

const Home: React.FC = () => {
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
};

export default Home;
```

The `priority` attribute is used for images that should be preloaded, such as those visible above the fold.

### Using External Images

To use external images with the `Image` component, you need to configure the domains in `next.config.js`:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    domains: ['example.com'],
  },
};

export default config;
```

Then you can use external images:

```typescript
<Image
  src="https://example.com/images/logo.png"
  alt="External Logo"
  width={200}
  height={100}
/>
```

## Adding Fonts

### Local Fonts

1. Add font files to the `public/fonts` directory.
2. Create a CSS file to define the font faces:

```css
/* styles/fonts.css */
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/MyCustomFont.woff2') format('woff2'),
       url('/fonts/MyCustomFont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

3. Import the CSS file in your `_app.js`:

```javascript
// pages/_app.js
import '../styles/fonts.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

4. Use the font in your CSS:

```css
/* styles/globals.css */
body {
  font-family: 'MyCustomFont', sans-serif;
}
```

### Using Google Fonts

Next.js 13 introduced a new Fonts API for easy integration with Google Fonts:

```javascript
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
```

## Adding Other Static Files

You can add any other static files to the `public` directory:

- `favicon.ico`: Automatically served at the root
- `robots.txt`: For search engine crawlers
- `sitemap.xml`: For SEO
- JSON data files
- PDF documents
- Audio and video files

Access these files directly from the root URL:

```javascript
<a href="/resume.pdf" download>Download Resume</a>
```

## Organizing Static Assets

For larger projects, it's good practice to organize your static assets into subdirectories:

```
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
```

## Summary

You've learned how to:

- Add static assets to the `public` directory
- Use the optimized `Image` component
- Add and use custom fonts
- Organize static assets for better maintainability

In the next section, we'll explore server-side rendering and static site generation in Next.js.

[Next: Server-Side Rendering and Static Site Generation →](./6-ssr-and-ssg.md)
