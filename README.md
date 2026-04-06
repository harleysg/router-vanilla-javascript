# Vanilla SPA

A lightweight Single Page Application (SPA) built with vanilla JavaScript and Express.js. This project demonstrates how to create a client-side router without any frontend frameworks.

## Features

- **Client-side routing** with vanilla JavaScript
- **Express.js** server for static file serving
- **SPA architecture** with dynamic page loading
- **History API** for browser navigation (back/forward buttons)
- **ES Modules** for modern JavaScript
- **Lifecycle management** with mount/unmount hooks

## Project Structure

```
.
├── index.js              # Express server entry point
├── package.json          # Project dependencies
└── public/               # Static assets
    ├── css/              # Stylesheets
    ├── index.html        # Main HTML template
    ├── pages/            # Page-specific assets
    └── scripts/
        └── index.mjs     # Router implementation
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run start:dev
```

The server will start on port `1234` (or the port specified in `PORT` environment variable) with hot-reloading enabled.

## How It Works

### Server

The Express server serves static files from the `public` directory and implements a catch-all route that returns `index.html` for all requests, enabling client-side routing. It also blocks access to `.json` files for security.

### Client-side Router

The custom router (`public/scripts/index.mjs`) provides:
- Route matching with regex patterns
- Dynamic module loading for pages
- Navigation interception for internal links
- Lifecycle hooks (mount/unmount)
- 404 fallback handling

### Adding New Pages

1. Create a new directory in `pages/` (e.g., `pages/contact/`)
2. Add an `index.js` file with an exported function returning HTML
3. Register the route in `public/index.html`:

```javascript
{
  page: 'contact',
  title: 'Contact',
  regex: '^/contact$',
  payload: async () => await import('/pages/contact/index.js')
}
```

## License

ISC
