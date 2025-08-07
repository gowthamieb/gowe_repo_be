require('dotenv').config(); // Load .env config
const mongoose = require('mongoose');
const Slot = require('./models/Slot.js'); // adjust if needed
const Gym = require('./models/Gym.js');

mongoose.set('strictQuery', true);

const MONGODB_URI = `${process.env.MONGODB_URI}/gymdb`;

const normalizeDate = (dateStr) => {
  const date = new Date(dateStr);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const slots = [
  {
    date: '2025-08-08',
    startTime: '06:00',
    endTime: '07:00',
    available: true,
    trainer: 'Arun',
    price: 300
  },
  {
    date: '2025-08-08',
    startTime: '07:00',
    endTime: '08:00',
    available: true,
    trainer: 'Neha',
    price: 300
  },
  {
    date: '2025-08-09',
    startTime: '08:00',
    endTime: '09:00',
    available: true,
    trainer: 'John',
    price: 300
  },
  {
    date: '2025-08-09',
    startTime: '09:00',
    endTime: '10:00',
    available: true,
    trainer: 'Neha',
    price: 300
  },
  {
    date: '2025-08-10',
    startTime: '18:00',
    endTime: '19:00',
    available: true,
    trainer: 'Arun',
    price: 300
  },
  {
    date: '2025-08-10',
    startTime: '19:00',
    endTime: '20:00',
    available: true,
    trainer: 'John',
    price: 300
  }
];

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ Connected to MongoDB: ${MONGODB_URI}`);

    await mongoose.connection.dropCollection('slots').catch(() => {
      console.log('ℹ️ slots collection does not exist, skipping drop');
    });

    const gym = await Gym.findOne({ name: /Gold['’]?s Gym Indiranagar/i });

    if (!gym) {
      console.error('❌ Gym not found. Please seed gyms first.');
      process.exit(1);
    }

    const slotsWithGym = slots.map((slot) => ({
      ...slot,
      date: normalizeDate(slot.date),
      gym: gym._id
    }));

    await Slot.insertMany(slotsWithGym);

    console.log('✅ Slot data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed slots:', error);
    process.exit(1);
  }
};

run();
