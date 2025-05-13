
# RI Medicare Backend

This is the backend server for the RI Medicare application.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/rimedicare?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

Replace the `MONGO_URI` with your MongoDB Atlas connection string.

### 3. Seed Demo Data (Optional)

To seed the database with demo data:

```bash
node seed.js
```

This will populate the database with demo users, hospitals, health cards, loans, transactions, and notifications.

### 4. Start the Server

```bash
npm run dev
```

The server will start on port 5000 (or the port specified in your environment variables).

## API Endpoints

### Authentication
- `POST /api/auth` - Login user
- `GET /api/auth` - Get logged-in user data

### Users
- `POST /api/users` - Register a new user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Add new hospital
- `GET /api/hospitals/:id` - Get hospital by ID
- `PUT /api/hospitals/:id` - Update hospital

### Health Cards
- `GET /api/health-cards` - Get all health cards for a user
- `POST /api/health-cards` - Create a health card (admin only)
- `GET /api/health-cards/:id` - Get health card by ID

### Loans
- `GET /api/loans` - Get all loans for a user
- `POST /api/loans` - Apply for a loan
- `PUT /api/loans/:id/approve` - Approve a loan application (admin only)

### Transactions
- `GET /api/transactions` - Get all transactions for a user
- `POST /api/transactions` - Create a transaction (hospital or admin)

### Notifications
- `GET /api/notifications` - Get all notifications for a user
- `POST /api/notifications` - Create a notification (admin only)
- `PUT /api/notifications/:id/read` - Mark notification as read

## Demo Login Credentials

All demo accounts use the password: `demo123`

- Patient: `patient@demo.com`
- Hospital: `hospital@demo.com`
- Admin: `admin@demo.com`
- Sales: `sales@demo.com`
- CRM: `crm@demo.com`
