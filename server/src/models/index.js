import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
});

const MedicalRecord = sequelize.define("MedicalRecord", {
  allergies: { type: DataTypes.JSON, allowNull: true },
  prescription: { type: DataTypes.STRING, allowNull: true },
  labOrders: { type: DataTypes.JSON, allowNull: true },
  labResults: { type: DataTypes.JSON, allowNull: true },
  filePath: { type: DataTypes.STRING, allowNull: true },
});

User.hasMany(MedicalRecord);
MedicalRecord.belongsTo(User);

export { sequelize, User, MedicalRecord };
