# Environmental Monitoring Dashboard - Frontend

This is the frontend application for the Environmental Monitoring Dashboard, providing real-time visualization of environmental data for port authorities.

## Features

- Real-time environmental data visualization
- Interactive dashboard with multiple metrics
- Time series charts for historical data
- Interactive map for sensor locations
- Dark mode support
- Responsive design

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Recharts
- Leaflet
- NextAuth.js

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start the development server:
```bash
npm run dev
```

## Components

### Dashboard Layout
- Responsive layout with dark mode support
- Navigation bar with theme toggle

### Environmental Cards
- Air Quality Card (CO2, NO2, SO2, PM2.5)
- Water Quality Card (pH, dissolved oxygen, oil spills)
- Noise Level Card
- Temperature & Humidity Card

### Data Visualization
- Time Series Chart for historical data
- Interactive Map for sensor locations

## Development

To start the development server with hot-reloading:

```bash
npm run dev
```

## Building for Production

To build the application for production:

```bash
npm run build
```

## Testing

To run tests:

```bash
npm test
```

## Deployment

The application can be deployed to Vercel:

```bash
vercel
```
