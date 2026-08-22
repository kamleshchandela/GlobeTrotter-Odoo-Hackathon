import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import googleRoutes from './routes/googleRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import healthcareRoutes from './routes/healthcareRoutes.js';
import sosRoutes from './routes/sosRoutes.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);



// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || "*",
  credentials: true,
}));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/sos', sosRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, service: "my-itinerary-api" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// Connect Database and Start Server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("Critical: Database connection failed. Server not started.", err.message);
  process.exit(1);
});

