import express from 'express';
import { getPatients, savePatientData, searchPatients } from '../controllers/practitionerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/patients', authMiddleware(['practitioner']), getPatients);
router.post('/patients/:patientId/medical-record', authMiddleware(['practitioner']), upload.single('file'), savePatientData);
router.get('/search', searchPatients);

export default router;
