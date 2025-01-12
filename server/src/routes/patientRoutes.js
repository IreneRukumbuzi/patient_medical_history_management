import express from 'express';
import {
  getMedicalHistory,
  getPatientSummary,
  getLabResults,
} from '../controllers/patientController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/history', authMiddleware(['patient']), getMedicalHistory);

router.get('/:id/summary', authMiddleware(['patient', 'practitioner']), getPatientSummary);
router.get('/:id/lab-results', authMiddleware(['patient', 'practitioner']), getLabResults);

export default router;
