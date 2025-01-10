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
});

User.hasMany(MedicalRecord);
MedicalRecord.belongsTo(User);

export { sequelize, User, MedicalRecord };
