import express from 'express';
import { getMedicalHistory } from '../controllers/patientController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/medical-history', authMiddleware(['patient']), getMedicalHistory);

export default router;
