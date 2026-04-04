# Mockstreet

Mockstreet is a real-time competitive trading platform where users can engage in head-to-head trading battles. Players compete to generate the highest profit within a set timeframe using virtual currency, leveraging real-time market data to make strategic trading decisions.

## Features

- **Multiplayer Trading Battles**: Create or join game rooms to compete against other players in real-time.
- **Live Market Data**: WebSocket integration provides accurate, up-to-the-second market candle data streaming.
- **Advanced Trading Mechanics**: Support for both long and short positions, margin calculation, and adjustable leverage (1x to 100x).
- **Real-time Portfolio Tracking**: Server-side PnL calculation ensures secure and accurate tracking of balances, unrealized PnL, and total equity.
- **In-game Communication**: Integrated chat system for players to communicate during active sessions.
- **Interactive Interface**: 3D elements and immersive graphics built with Three.js and modern web design principles.

## Technologies Used

- **Framework**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, shadcn/ui, Radix UI
- **Real-time Communication**: Socket.io-client
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Data Visualization**: Lightweight Charts, Recharts
- **API and Auth**: Axios, Supabase Client

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your system.

### Installation

1. Navigate to the project directory:

```bash
cd mockstreet/site
```

2. Install the required dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Project Structure

The project follows a standard Next.js App Router architecture:

- `app/`: Main routing, layouts, and page components.
- `components/`: Reusable React components including the trading interface, game lobby, and matchmaking elements.
- `hooks/`: Custom React hooks for managing state and WebSocket connections.
- `lib/`: Utility functions and API configuration.
- `public/`: Static directory for images, 3D models, and other public assets.
- `types/`: TypeScript type definitions.

## Backend Integration

The frontend client communicates with a dedicated backend server that handles game logic, authentication, and WebSocket data broadcasting. For full multiplayer and trading functionality, ensure the backend service is running locally or properly configured in the application's environment variables.
