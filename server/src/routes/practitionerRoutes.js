import express from 'express';
import { getPatients, addRecord } from '../controllers/practitionerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/patients', authMiddleware(['practitioner']), getPatients);
router.post('/patients/:id/records', authMiddleware(['practitioner']), addRecord);

export default router;
