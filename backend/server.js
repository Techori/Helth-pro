const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patient');
const http = require('http');
const { Server } = require('socket.io');

console.log('Starting server initialization...');

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  console.log(`=== ${req.method} ${req.originalUrl} ===`);
  console.log("Request Body:", req.body);
  console.log("Query Params:", req.query);

  const oldSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    console.log(`Response Time: ${duration}ms`);
    console.log(`Status Code: ${res.statusCode}`);
    console.log("=== End Request ===\n");
    return oldSend.apply(res, arguments);
  };

  next();
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

try {
  // Load env vars
  require("dotenv").config();
  console.log("Environment variables loaded");
} catch (err) {
  console.error("Error loading environment variables:", err);
  process.exit(1);
}

// Connect to database
console.log("Attempting database connection...");
connectDB()
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_CLIENT_URL || "http://localhost:8080",
    methods: ['GET', 'POST']
  }
});
app.set('io', io);
console.log("Socket.IO initialized");

// Middleware
try {
  console.log("Initializing middleware...");
  app.use(express.json({ extended: false }));
  app.use(cors());
  app.use(requestLogger);
  console.log("Middleware initialized: JSON parser, CORS, and request logger enabled");
} catch (err) {
  console.error("Error initializing middleware:", err);
}

// Health check endpoint
const healthCheckHandler = (req, res) => {
  try {
    console.log("=== GET /health ===");
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      version: process.env.npm_package_version || "1.0.0",
    };

    console.log("Health check data:", healthData);
    console.log("=== End Health Check ===\n");

    res.json(healthData);
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({
      status: "unhealthy",
      error: "Health check failed",
      timestamp: new Date().toISOString(),
    });
  }
};

// Register health check endpoints
app.get("/health", healthCheckHandler);
app.get("/api/health", healthCheckHandler);
console.log("Health check endpoints registered at /health and /api/health");

// Define Routes with error handling
console.log("Setting up API routes...");
const setupRoute = (path, router) => {
  try {
    router.use((req, res, next) => {
      console.log(`[${path}] Handling ${req.method} request`);
      next();
    });

    app.use(path, router);
    console.log(`Route registered successfully: ${path}`);

    const methods = [];
    router.stack.forEach((layer) => {
      if (layer.route) {
        methods.push(...Object.keys(layer.route.methods));
      }
    });
    console.log(`Available methods for ${path}: [${methods.join(", ").toUpperCase()}]`);
  } catch (err) {
    console.error(`Error setting up route ${path}:`, err);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
setupRoute('/api/auth', require('./routes/auth'));
setupRoute('/api/users', require('./routes/users'));
setupRoute('/api/health-cards', require('./routes/healthCards'));
setupRoute('/api/loans', require('./routes/loans'));
setupRoute('/api/kyc', require('./routes/kyc')); // Uses updated kyc.js
setupRoute('/api/transactions', require('./routes/transactions'));
setupRoute('/api/notifications', require('./routes/notifications'));
setupRoute('/api/staff', require('./routes/staffRoutes'));
setupRoute('/api/patient', patientRoutes);
setupRoute('/api/face-auth', require('./routes/face-verification'));
setupRoute('/api/hospitalusers', require('./routes/HospitalUser'));
setupRoute('/api/support/tickets', require('./routes/supportTickets'));

setupRoute('/api', require('./routes/upload')); // Upload route
setupRoute('/api', require('./routes/files')); 

setupRoute('/api', require('./routes/hospitals'));

setupRoute('/api/admin', require('./routes/admin'));


// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  try {
    console.log("Production mode detected - setting up static file serving");
    app.use(express.static("client/build"));
    console.log("Static folder set to: client/build");

    app.get("*", (req, res) => {
      console.log(`Serving index.html for path: ${req.path}`);
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  } catch (err) {
    console.error("Error setting up static file serving:", err);
  }
} else {
  console.log("Development mode detected - static serving disabled");
}

// Add global error handler
app.use(errorHandler);

// Get route information
const getRouteInfo = (app) => {
  try {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods),
        });
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push({
              path: middleware.regexp.source + handler.route.path,
              methods: Object.keys(handler.route.methods),
            });
          }
        });
      }
    });

    routes.push({
      path: "/api/health",
      methods: ["get"],
    });

    return routes;
  } catch (err) {
    console.error("Error getting route information:", err);
    return [];
  }
};

// Start server
try {
  server.listen(process.env.PORT || 5000, () => {
    const PORT = process.env.PORT || 5000;
    const routes = getRouteInfo(app);
    console.log("=================================");
    console.log(`Server configuration summary:`);
    console.log(`- Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`- Port: ${PORT}`);
    console.log(`- Total API Routes: ${routes.length}`);
    console.log("\nRegistered Routes:");
    routes.forEach((route) => {
      console.log(`  ${route.path} [${route.methods.join(", ").toUpperCase()}]`);
    });
    console.log("=================================");
    console.log(`Server is now listening on port ${PORT}`);
  }).on("error", (err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
} catch (err) {
  console.error("Critical server error:", err);
  process.exit(1);
}