// seedGyms.js
require('dotenv').config(); // Must be at the top!

const mongoose = require('mongoose');
const Gym = require('./models/Gym.js'); // adjust this if the path is incorrect

const sampleGyms_bk = [
  {
    name: "Fitness First Downtown",
    address: {
      street: "123 Main St",
      city: "City Center",
      state: "NY",
      postalCode: "10001",   // <-- add a valid postal code here
      country: "USA"
    },
    location: {
      type: "Point",
      coordinates: [-73.9857, 40.7484]
    },
    facilities: ["Weights", "Cardio", "Pool", "Yoga"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80",
        description: "Modern gym interior",
        isFeatured: true
      }
    ],
    openingHours: {
      monday: { open: "06:00", close: "22:00" },
      tuesday: { open: "06:00", close: "22:00" },
      wednesday: { open: "06:00", close: "22:00" },
      thursday: { open: "06:00", close: "22:00" },
      friday: { open: "06:00", close: "22:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "08:00", close: "20:00" }
    },
    rating: { average: 4.5, count: 30 }
  },
  {
    name: "Iron Temple Gym",
    address: {
      street: "456 Fitness Ave",
      city: "West District",
      state: "NY",
      postalCode: "10002",  // <-- add valid postal code here
      country: "USA"
    },
    location: {
      type: "Point",
      coordinates: [-73.9800, 40.7520]
    },
    facilities: ["Weights", "Crossfit", "Sauna"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
        description: "Crossfit gym",
        isFeatured: true
      }
    ],
    openingHours: {
      monday: { open: "05:00", close: "23:00" },
      tuesday: { open: "05:00", close: "23:00" },
      wednesday: { open: "05:00", close: "23:00" },
      thursday: { open: "05:00", close: "23:00" },
      friday: { open: "05:00", close: "23:00" },
      saturday: { open: "07:00", close: "21:00" },
      sunday: { open: "07:00", close: "21:00" }
    },
    rating: { average: 4.8, count: 45 }
  }
];

const sampleGyms = [
  {
    name: 'Gold’s Gym Indiranagar',
    address: {
      street: '12th Main Rd, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.6368, 12.9716] },
    facilities: ['Weights', 'Cardio', 'Classes', 'Lockers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80',
        description: 'Weight area',
        isFeatured: true
      }
    ],
    openingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '08:00', close: '20:00' }
    },
    rating: { average: 4.3, count: 150 },
    description: 'A premier gym offering state-of-the-art equipment and professional training programs.',
    capacity: 100,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1500, premium: 2500 },
    phone: '+91-9876543210',
    email: 'info@goldsgymindiranagar.in'
  },
  {
    name: 'Snap Fitness HSR Layout',
    address: {
      street: '15, 1st Sector, HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560102',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.6412, 12.9196] },
    facilities: ['Weights', 'Cardio', 'Showers', 'Lockers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
        description: 'Cardio section',
        isFeatured: true
      }
    ],
    openingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '08:00', close: '20:00' }
    },
    rating: { average: 4.3, count: 150 },
    description: 'Premium gym with top-quality equipment and excellent trainers.',
    capacity: 90,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1400, premium: 2400 },
    phone: '+91-9876543211',
    email: 'info@snapfitnesshsr.in'
  },
  {
    name: 'Cult Fit JP Nagar',
    address: {
      street: '100 Feet Ring Rd, JP Nagar 7th Phase',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560078',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.5770, 12.9148] },
    facilities: ['Classes', 'Personal Training', 'Yoga', 'Showers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
        description: 'Group class',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '06:00', close: '22:00' }, weekends: { open: '08:00', close: '20:00' } },
    rating: { average: 4.2, count: 340 },
    description: 'Popular fitness chain known for group workouts and Yoga sessions.',
    capacity: 120,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1300, premium: 2300 },
    phone: '+91-9876543212',
    email: 'jp@cultfit.in'
  },
  {
    name: 'Volt Fitness Club Indiranagar',
    address: {
      street: '12th Main Rd, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.6370, 12.9718] },
    facilities: ['Weights', 'Crossfit', 'Personal Training', 'Showers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1',
        description: 'Weights and equipment',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '05:00', close: '23:00' }, weekends: { open: '07:00', close: '21:00' } },
    rating: { average: 4.6, count: 95 },
    description: 'Modern facility with specialized strength and conditioning programs.',
    capacity: 85,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1600, premium: 2700 },
    phone: '+91-9876543213',
    email: 'info@voltfitness.in'
  },
  {
    name: 'Rage Fitness Club Indiranagar',
    address: {
      street: 'Indiranagar Double Rd, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.6365, 12.9798] },
    facilities: ['Weights', 'Cardio', 'Lockers', 'Showers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80',
        description: 'Cardio workout',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '06:00', close: '22:00' }, weekends: { open: '08:00', close: '20:00' } },
    rating: { average: 4.4, count: 220 },
    description: 'Compact yet complete gym with Cardio and Functional zones.',
    capacity: 75,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1400, premium: 2400 },
    phone: '+91-9876543214',
    email: 'info@ragefitness.in'
  },
  {
    name: 'The Outfit Gym Koramangala',
    address: {
      street: '5th A Main Rd, Koramangala 1st Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560034',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.6388, 12.9352] },
    facilities: ['Classes', 'Sauna', 'Yoga', 'Lockers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
        description: 'Yoga studio area',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '06:00', close: '22:00' }, weekends: { open: '07:00', close: '21:00' } },
    rating: { average: 4.5, count: 110 },
    description: 'Wellness-focused gym offering Yoga, Sauna, and calm atmosphere.',
    capacity: 90,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1550, premium: 2550 },
    phone: '+91-9876543215',
    email: 'outfit@koramangala.in'
  },
  {
    name: 'High Fitness Club Jayanagar',
    address: {
      street: '33rd Cross, Jayanagar 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560011',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.5846, 12.9264] },
    facilities: ['Weights', 'Cardio', 'Lockers', 'Showers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
        description: 'Training area',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '06:00', close: '22:00' }, weekends: { open: '08:00', close: '20:00' } },
    rating: { average: 4.6, count: 194 },
    description: 'Complete gym experience with all modern amenities.',
    capacity: 110,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1500, premium: 2500 },
    phone: '+91-9876543216',
    email: 'info@highfitness.in'
  },
  {
    name: 'Power World Gym Vidyaranyapura',
    address: {
      street: 'Vidyaranyapura Main Rd, NTI Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560097',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.5583, 13.0772] },
    facilities: ['Weights', 'Crossfit', 'Classes', 'Showers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1',
        description: 'Gym training space',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '05:30', close: '23:00' }, weekends: { open: '07:00', close: '21:00' } },
    rating: { average: 4.2, count: 203 },
    description: 'Community-focused gym with group sessions and cross-training.',
    capacity: 100,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1450, premium: 2450 },
    phone: '+91-9876543217',
    email: 'vidya@powerworld.in'
  },
  {
    name: 'Anytime Fitness Whitefield',
    address: {
      street: 'Whitefield Main Rd',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560066',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.7499, 12.9719] },
    facilities: ['Weights', 'Cardio', 'Personal Training'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
        description: 'Modern Cardio setup',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '00:00', close: '23:59' }, weekends: { open: '00:00', close: '23:59' } },
    rating: { average: 4.4, count: 188 },
    description: '24/7 gym access with personal training options and clean equipment.',
    capacity: 95,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1600, premium: 2600 },
    phone: '+91-9876543218',
    email: 'contact@anytimewhitefield.in'
  },
  {
    name: 'FitBox Koramangala',
    address: {
      street: '6th Block, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560095',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.6215, 12.9320] },
    facilities: ['Crossfit', 'Functional', 'Weights', 'Personal Training'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1',
        description: 'Crossfit area',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '06:00', close: '22:00' }, weekends: { open: '08:00', close: '20:00' } },
    rating: { average: 4.7, count: 132 },
    description: 'Hardcore training environment for Crossfit and bodyweight training.',
    capacity: 80,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1500, premium: 2700 },
    phone: '+91-9876543219',
    email: 'info@fitboxkormangala.in'
  },
  {
    name: 'BodyPower Jayanagar',
    address: {
      street: '9th Block, Jayanagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560041',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.5894, 12.9145] },
    facilities: ['Weights', 'Body Building', 'Personal Training', 'Lockers'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
        description: 'Heavy lifting zone',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '05:30', close: '22:30' }, weekends: { open: '07:00', close: '21:00' } },
    rating: { average: 4.3, count: 166 },
    description: 'Serious gym for Body Building enthusiasts and powerlifters.',
    capacity: 90,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1550, premium: 2600 },
    phone: '+91-9876543220',
    email: 'contact@bodypowerjay.in'
  },
  {
    name: 'Iron Cult Rajajinagar',
    address: {
      street: '12th Cross Rd, Rajajinagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560010',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.5564, 12.9916] },
    facilities: ['Weights', 'Functional', 'Cardio', 'Yoga'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
        description: 'Group Functional training',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '05:30', close: '22:00' }, weekends: { open: '07:00', close: '20:00' } },
    rating: { average: 4.5, count: 210 },
    description: 'Unique blend of traditional Weights and modern movement training.',
    capacity: 85,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1450, premium: 2500 },
    phone: '+91-9876543221',
    email: 'info@ironcult.in'
  },
  {
    name: 'Fitness First MG Road',
    address: {
      street: '1 MG Road Mall',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.6190, 12.9764] },
    facilities: ['Weights', 'Personal Training', 'Yoga', 'Spa', 'Pool'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
        description: 'Premium Spa and recovery',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '06:00', close: '23:00' }, weekends: { open: '08:00', close: '22:00' } },
    rating: { average: 4.8, count: 298 },
    description: 'Luxury fitness club with top-class amenities and personal trainers.',
    capacity: 130,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 2000, premium: 3500 },
    phone: '+91-9876543222',
    email: 'contact@fitnessfirstmg.in'
  },
  {
    name: 'Beast Mode Basavanagudi',
    address: {
      street: 'Bugle Rock Rd, Basavanagudi',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560004',
      country: 'India'
    },
    location: { type: 'Point', coordinates: [77.5735, 12.9436] },
    facilities: ['Weights', 'Crossfit', 'Cardio'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
        description: 'High intensity zone',
        isFeatured: true
      }
    ],
    openingHours: { weekdays: { open: '05:00', close: '23:00' }, weekends: { open: '06:00', close: '21:00' } },
    rating: { average: 4.6, count: 180 },
    description: 'High-performance gym for athletes and martial artists.',
    capacity: 100,
    availableSlots: [
      {
        date: '2025-07-29',
        startTime: '06:00',
        endTime: '07:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-29',
        startTime: '07:00',
        endTime: '08:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-30',
        startTime: '08:00',
        endTime: '09:00',
        available: true,
        trainer: 'John'
      },
      {
        date: '2025-07-30',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
        trainer: 'Neha'
      },
      {
        date: '2025-07-31',
        startTime: '18:00',
        endTime: '19:00',
        available: true,
        trainer: 'Arun'
      },
      {
        date: '2025-07-31',
        startTime: '19:00',
        endTime: '20:00',
        available: true,
        trainer: 'John'
      }
    ],
    trainerAvailable: true,
    pricing: { standard: 1600, premium: 2800 },
    phone: '+91-9876543223',
    email: 'info@beastmode.in'
  }
];


async function seedDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in your .env file");
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/gymdb`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');

    await Gym.deleteMany({});
    await Gym.insertMany(sampleGyms);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
