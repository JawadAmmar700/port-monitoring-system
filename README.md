# Port Monitoring System - Frontend

This is the frontend application for the Port Monitoring System, providing a modern and interactive interface for monitoring port operations, environmental conditions, and vessel movements.

## Features

- Real-time environmental data visualization
- Vessel tracking and management
- Interactive dashboard with multiple metrics
- Time series charts for historical data
- Interactive map for sensor locations
- Responsive design
- Email-based authentication
- Role-based access control (Manager/Employee)

## Tech Stack

- Next.js 15.3.1
- TypeScript
- Tailwind CSS
- Prisma (MongoDB)
- NextAuth.js
- Socket.IO Client
- Recharts
- Framer Motion
- Lucide React Icons

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB database
- Mailtrap account for email authentication

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` and a `.env` files with the following variables:

```.env
## In the .env file

# Database
DATABASE_URL="mongodb://localhost:27017/port-monitoring" # Add your own MongoDB connection string

# Auth.js Authentication
AUTH_SECRET="your-auth-secret"  # Generate using: openssl rand -base64 32
BACKEND_URL=http://localhost:3001
AUTH_TRUST_HOST=http://localhost:3000

# Email Configuration (Choose either Mailtrap or Brevo)
# Option 1: Mailtrap (for development)
SMTP_HOST="smtp.mailtrap.io"
SMTP_USERNAME="your-username"
SMTP_PASSWORD="your-password"
SMTP_PORT=587
EMAIL_FROM="noreply@yourdomain.com"

# Option 2: Brevo (for production)
SMTP_HOST="smtp-relay.brevo.com"
SMTP_USERNAME="your-username"
SMTP_PASSWORD="your-password"
SMTP_PORT=587
EMAIL_FROM="your-verified-sender@yourdomain.com"
```

```.env.local
## In the .env.local file

NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
```

⚠️ **Important Note for Brevo Users:**

- No temporary/fake email addresses allowed
- Account blocking risk with invalid emails
- Use real email addresses in seed data
- Verify sender email address

3. Initialize the database:

```bash
npm run prisma:generate
```

4. Seed the database with initial data:

```bash
npm run prisma:seed
```

## Email Service Setup

### Option 1: Mailtrap (Recommended for Development)

1. Sign up for a Mailtrap account at https://mailtrap.io
2. Go to your Mailtrap inbox
3. Click on "Show Credentials"
4. Copy the SMTP credentials and update your `.env` file:
   - MAILTRAP_HOST
   - MAILTRAP_USERNAME
   - MAILTRAP_PASSWORD
   - MAILTRAP_PORT

### Option 2: Brevo (Recommended for Production)

1. Sign up for a Brevo account at https://www.brevo.com
2. Go to SMTP & API settings
3. Create an SMTP API key
4. Update your `.env` file with Brevo credentials:
   - BREVO_HOST
   - BREVO_USERNAME
   - BREVO_PASSWORD
   - BREVO_PORT
   - EMAIL_FROM (must be a verified sender)

⚠️ **Important Note for Brevo Users:**

- Brevo does not allow sending emails to temporary or fake email addresses
- Using temporary email addresses will result in account blocking
- When using Brevo, update the `prisma/seed.ts` file with real email addresses
- Use real Gmail or other valid email addresses for testing
- Make sure to verify your sender email address in Brevo before sending emails

## Authentication

The application uses email-based authentication with magic links. Users are divided into two roles:

- Manager: Full access to all features
- Employee: Limited access to monitoring features

Default test accounts (created by seed script):

- Manager: micey97158@harinv.com
- Employee: ruzysy892@chapsmail.com

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

To start the production server:

```bash
npm start
```

## Database Management

Generate Prisma client:

```bash
npm run prisma:generate
```

Run Prisma studio:

```bash
npx prisma studio
```

Seed the database:

```bash
npm run prisma:seed
```

## Project Structure

```
frontend/
├── src/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── server/        # Server-side code
│   └── styles/        # Global styles
├── prisma/            # Database schema and migrations
├── public/            # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
