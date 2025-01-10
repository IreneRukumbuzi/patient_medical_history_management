import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import practitionerRoutes from './routes/practitionerRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import { sequelize } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/practitioner', practitionerRoutes);
app.use('/api/patient', patientRoutes);

// Database Connection
sequelize.authenticate().then(() => {
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
