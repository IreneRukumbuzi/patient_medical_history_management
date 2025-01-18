import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
});

const MedicalRecord = sequelize.define('MedicalRecord', {
  type: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.JSON, allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: true },
  recordType: {
    type: DataTypes.ENUM('allergy', 'prescription', 'lab-order', 'lab-result'),
    allowNull: false,
  },
  batchId: { type: DataTypes.INTEGER, allowNull: true },
  parentId: { type: DataTypes.INTEGER, allowNull: true },
});

User.hasMany(MedicalRecord);
MedicalRecord.belongsTo(User);
MedicalRecord.hasMany(MedicalRecord, {
  foreignKey: 'parentId',
  as: 'labResults',
});

export { sequelize, User, MedicalRecord };