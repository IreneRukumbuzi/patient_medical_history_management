import bcrypt from 'bcrypt';
import { sequelize } from '../models/index.js';
import { User } from '../models/index.js';

const seedDatabase = async () => {
  try {
    const hashedPassword = bcrypt.hashSync('pass123', 10);

    await User.create({ username: 'Dr. Mugabo Joseph', password: hashedPassword, role: 'practitioner' });

    await User.bulkCreate([
      { username: 'Mugisha Bosco', password: hashedPassword, role: 'patient' },
      { username: 'Muhire Emmanuel', password: hashedPassword, role: 'patient' },
      { username: 'Mukarukundo Alice', password: hashedPassword, role: 'patient' },
      { username: 'Munezero Aline', password: hashedPassword, role: 'patient' },
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
