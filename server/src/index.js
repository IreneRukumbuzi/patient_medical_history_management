import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import practitionerRoutes from './routes/practitionerRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import { sequelize } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: 'https://patient-medical-history-management.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/practitioner', practitionerRoutes);
app.use('/api/patient', patientRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Patient Medical History Management API');
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');

    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });