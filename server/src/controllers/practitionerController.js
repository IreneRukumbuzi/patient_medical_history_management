import { User, MedicalRecord } from '../models/index.js';
import { Op } from 'sequelize';

export const getPatients = async (req, res) => {
  try {
    const patients = await User.findAll({ where: { role: 'patient' }, attributes: ['id', 'username'] });
    
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patients', error });
  }
};

export const searchPatients = async (req, res) => {
  const { query } = req.query;
  console.log("this is the query", query);
  
  try {
    const patients = await User.findAll({
      where: {
        role: 'patient', 
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { id: isNaN(query) ? null : parseInt(query) },
        ],
      },
    });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error });
  }
};

export const savePatientData = async (req, res) => {
  const { patientId } = req.params;
  const { type, data, recordType } = req.body;

  try {
    if (!type || !data || !recordType) {
      return res.status(400).json({ message: 'Type, data, and recordType are required' });
    }

    if (!['allergy', 'prescription', 'lab-order', 'lab-result'].includes(recordType)) {
      return res.status(400).json({ message: 'Invalid record type' });
    }

    const patient = await User.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newRecord = await MedicalRecord.create({
      type,
      data,
      recordType,
      filePath: req.file ? req.file.path : null,
      UserId: patientId,
    });

    res.json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error saving medical record', error });
  }
};