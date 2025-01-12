import bcrypt from 'bcrypt';
import { sequelize } from '../models/index.js';
import { User } from '../models/index.js';

const seedDatabase = async () => {
  try {
    const hashedPassword = bcrypt.hashSync('pass123', 10);

    // Create a practitioner
    await User.create({ username: 'doc1', password: hashedPassword, role: 'practitioner' });

    // Create patients
    await User.bulkCreate([
      { username: 'patient1', password: hashedPassword, role: 'patient' },
      { username: 'patient2', password: hashedPassword, role: 'patient' },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

const resetDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database reset successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

const syncAndSeed = async () => {
  await resetDatabase();
  await seedDatabase();
  process.exit(0);
};

const command = process.argv[2];
if (command === 'seed') {
  syncAndSeed();
} else if (command === 'reset') {
  resetDatabase().then(() => process.exit(0));
} else {
  console.log('Usage: node src/config/seed.js [seed|reset]');
  process.exit(1);
}
