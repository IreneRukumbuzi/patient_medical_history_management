import { MedicalRecord } from '../models/index.js';

export const getMedicalHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { id } = req.user;

    const offset = (page - 1) * limit;
    const records = await MedicalRecord.findAndCountAll({
      where: { UserId: id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: records.count,
      pages: Math.ceil(records.count / limit),
      records: records.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching medical records", error });
  }
};