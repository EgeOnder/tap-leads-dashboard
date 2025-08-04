# TAP Leads Dashboard

A Next.js dashboard application for managing leads and websites with secure authentication, designed for deployment as a Docker container on local company servers.

## Environment Setup

This application uses PostgreSQL with Drizzle ORM and secure authentication. You need to set up the following environment variables in your `.env` file:

```env
# PostgreSQL Database Configuration
DB_HOST=""
DB_PORT=""
DB_USERNAME=""
DB_PASSWORD=""
DB_NAME=""

# Authentication (REQUIRED for production)
ADMIN_PASSWORD=""

# Next.js Configuration
NODE_ENV=production
```

## Authentication

The dashboard uses secure session-based authentication:

-   **Session Persistence**: Sessions are stored in HTTP-only cookies and persist for 7 days
-   **Password Security**: Passwords are hashed using bcrypt
-   **API Protection**: All API routes are protected by session validation
-   **Single Sign-On**: Once authenticated, users stay logged in until they logout or the session expires

## Getting Started

1. Install dependencies:

    ```bash
    npm install
    ```

2. Set up your PostgreSQL database and create a `.env` file with the credentials above.

3. Run database migrations to create the tables:

    ```bash
    npm run db:push
    ```

    This will create the necessary tables in your PostgreSQL database. The database will start empty - no sample data will be inserted.

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Access the dashboard at `http://localhost:3000` and enter the admin password.

## Database Schema

The application uses two main tables:

-   `website`: Stores website information
-   `leads`: Stores lead information with foreign key relationship to websites

## Available Scripts

-   `npm run dev`: Start development server
-   `npm run build`: Build for production
-   `npm run start`: Start production server
-   `npm run lint`: Run ESLint
-   `npm run db:push`: Push schema changes to database
-   `npm run db:generate`: Generate migration files
-   `npm run db:studio`: Open Drizzle Studio for database management

## Docker Container

This application is packaged as a Docker container for easy integration into existing company infrastructure.

### Building the Container

```bash
# Build the Docker image
docker build -t tap-leads-dashboard .

# Run the container
docker run -p 3000:3000 \
  -e DB_HOST="your-db-host" \
  -e DB_PORT="5432" \
  -e DB_USERNAME="your-username" \
  -e DB_PASSWORD="your-password" \
  -e DB_NAME="your-database" \
  -e ADMIN_PASSWORD="your_secure_password" \
  tap-leads-dashboard
```

### Container Configuration

-   **Port**: 3000 (internal)
-   **Environment**: Production-optimized
-   **Base Image**: Node.js 18 Alpine
-   **User**: Non-root for security
-   **Health Check**: Available at `/health` endpoint

### Integration with Existing Infrastructure

This container is designed to be integrated into your existing:

-   Docker Compose setup
-   NGINX reverse proxy configuration
-   Company network infrastructure

### Environment Variables

Required environment variables:

-   `DB_HOST`: PostgreSQL host address
-   `DB_PORT`: PostgreSQL port (default: 5432)
-   `DB_USERNAME`: Database username
-   `DB_PASSWORD`: Database password
-   `DB_NAME`: Database name
-   `ADMIN_PASSWORD`: Strong admin password for authentication
