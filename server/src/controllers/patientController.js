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


export const uploadLabResult = async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = req.file.path;

    const labResult = await MedicalRecord.create({ patientId: id, filePath });

    res.status(201).json({ success: true, labResult });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading lab result' });
  }
};

export const getLabResults = async (req, res) => {
  const { id } = req.params;

  try {
    const labResults = await MedicalRecord.findAll({
      where: { patientId: id, recordType: 'lab-result' },
    });

    if (labResults.length === 0) {
      return res.status(404).json({ message: 'No lab results found for this patient.' });
    }

    res.status(200).json({ success: true, labResults });
  } catch (error) {
    console.error('Error retrieving lab results:', error);
    res.status(500).json({ error: 'Error retrieving lab results' });
  }
};


export const getPatientSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const activePrescriptionsCount = await MedicalRecord.count({
      where: { patientId: id, recordType: 'prescription' },
    });

    const pendingLabResultsCount = await MedicalRecord.count({
      where: { patientId: id, recordType: 'lab-result', filePath: null },
    });

    res.status(200).json({
      success: true,
      summary: {
        activePrescriptions: activePrescriptionsCount,
        pendingLabResults: pendingLabResultsCount,
      },
    });
  } catch (error) {
    console.error('Error retrieving patient summary:', error);
    res.status(500).json({ error: 'Error retrieving patient summary' });
  }
};
