import { MedicalRecord } from '../models/index.js';

export const getMedicalHistory = async (req, res) => {
  const { id } = req.user;

  try {
    const records = await MedicalRecord.findAll({ where: { UserId: id } });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving medical history', error });
  }
};
