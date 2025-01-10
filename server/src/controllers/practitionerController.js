import { User, MedicalRecord } from '../models/index.js';

export const getPatients = async (req, res) => {
  try {
    const patients = await User.findAll({ where: { role: 'patient' }, attributes: ['id', 'username'] });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patients', error });
  }
};

export const addRecord = async (req, res) => {
  const { id } = req.params;
  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({ message: 'Type and data are required' });
  }

  try {
    const patient = await User.findByPk(id);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const record = await MedicalRecord.create({
      type,
      data,
      UserId: id,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error adding record', error });
  }
};
