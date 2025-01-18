import { User, MedicalRecord } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

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

export const getOverview = async (req, res) => {
  try {
    const totalPatients = await User.count({
      where: {
        role: 'patient',
      },
    });

    const totalRecords = await MedicalRecord.count();

    const recordTypesCount = await MedicalRecord.findAll({
      attributes: [
        'type',
        [fn('COUNT', col('type')), 'count'],
      ],
      group: ['type'],
    });

    const recordTypesMap = {};
    recordTypesCount.forEach((typeCount) => {
      recordTypesMap[typeCount.type] = typeCount.get('count');
    });

    const recordsPerMonth = await MedicalRecord.findAll({
      attributes: [
        [fn('EXTRACT', literal('MONTH FROM "createdAt"')), 'month'],
        [fn('EXTRACT', literal('YEAR FROM "createdAt"')), 'year'],
        [fn('COUNT', col('*')), 'count'],
      ],
      group: ['month', 'year'],
      order: [
        [fn('EXTRACT', literal('YEAR FROM "createdAt"')), 'ASC'],
        [fn('EXTRACT', literal('MONTH FROM "createdAt"')), 'ASC'],
      ],
    });


    const recordsMap = new Map();
    recordsPerMonth.forEach((record) => {
      const month = parseInt(record.get('month'), 10);
      const year = parseInt(record.get('year'), 10);
      const count = parseInt(record.get('count'), 10);
      const key = `${year}-${month}`;
      recordsMap.set(key, count);
    });

    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const recordsPerMonthData = months.map((month) => {
      const key = `${currentYear}-${month}`;
      return recordsMap.get(key) || 0;
    });

    res.status(200).json({
      totalPatients,
      totalRecords,
      recordTypesCount: recordTypesMap,
      recordsPerMonth: recordsPerMonthData,
    });
  } catch (error) {
    console.error('Error fetching overview data:', error);
    res.status(500).json({ message: 'Error fetching overview data', error: error.message });
  }
};


export const getRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const records = await MedicalRecord.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['username'] }],
    });

    res.status(200).json({
      total: records.count,
      pages: Math.ceil(records.count / limit),
      records: records.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medical records', error });
  }
};