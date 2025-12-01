# POS - Point of Sale Application

A modern React application built with Vite, TypeScript, Redux Toolkit, and Tailwind CSS for retail point-of-sale operations.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit, Redux Persist
- **Styling**: Tailwind CSS, Framer Motion
- **Real-time**: MQTT for live updates
- **Testing**: Vitest, React Testing Library

## Available Scripts

### `npm run dev`
Runs the app in development mode with hot reload.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder with optimizations.

### `npm run preview`
Serves the production build locally for testing.

### `npm test`
Runs the test suite with Vitest.

### `npm run test:ui`
Runs tests with Vitest UI for interactive testing.

## Docker Usage

### Production
```bash
# Build and run production container
docker-compose up --build
```

### Development
```bash
# Run with hot reload for development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `VITE_BASE_URL`: API base URL
- `VITE_CLIENT_ID`: Client identifier
- `VITE_MQTT_*`: MQTT configuration for real-time updates

## Browser Support
Optimized for Android 4.0+, Chrome 30+, iOS 8+, Safari 8+ with legacy polyfills.

## Development

1. Install dependencies: `npm ci`
2. Copy environment: `cp .env.example .env`
3. Start development: `npm run dev`