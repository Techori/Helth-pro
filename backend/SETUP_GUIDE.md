
# RI Medicare Backend Setup Guide

This document provides detailed instructions for setting up the RI Medicare backend server.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

## Step 1: MongoDB Atlas Setup

1. Create a MongoDB Atlas account if you don't have one: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)

2. Create a new cluster (Free tier is sufficient for development)

3. Create a database user:
   - Click on "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Enter username and password
   - Set appropriate permissions (Read and Write to any database)

4. Set up network access:
   - Click on "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add your current IP address or set to allow access from anywhere (0.0.0.0/0) for development

5. Get your connection string:
   - Click "Connect" button on your cluster
   - Select "Connect your application"
   - Copy the connection string (It looks like: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`)

## Step 2: Configure Environment Variables

1. Create a `.env` file in the root of the backend directory:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/rimedicare?retryWrites=true&w=majority
JWT_SECRET=your_strong_secret_key_here
```

2. Replace:
   - `<username>` and `<password>` with your MongoDB Atlas database user credentials
   - `<cluster>` with your cluster name
   - `your_strong_secret_key_here` with a secure random string for JWT token signing

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Seed the Database (Optional)

To populate the database with demo data:

```bash
node seed.js
```

This will create demo users, hospitals, health cards, loans, transactions, and notifications.

## Step 5: Start the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on port 5000 (or the port specified in your `.env` file).

## Step 6: Test the API

You can test the API using tools like Postman or curl:

```bash
# Test the server is running
curl http://localhost:5000/api/auth

# Login with a demo user
curl -X POST http://localhost:5000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@demo.com","password":"demo123"}'
```

## Connecting to the Frontend

Update your frontend API service to point to this backend:

```typescript
// In src/services/api.ts
const API_URL = 'http://localhost:5000/api';
```

## Deploying to Production

For production deployment:

1. Set up a production MongoDB Atlas cluster
2. Configure environment variables on your hosting provider
3. Deploy the Node.js application to your preferred hosting service (Heroku, Vercel, AWS, etc.)

## Common Issues

1. **Connection Errors**: Verify your IP address is whitelisted in MongoDB Atlas Network Access settings

2. **Authentication Errors**: Verify database username and password are correct in your connection string

3. **CORS Issues**: The backend has CORS enabled, but if you encounter issues, check the origin config
