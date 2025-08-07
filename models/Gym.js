const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Gym name is required'],
    trim: true,
    maxlength: [100, 'Gym name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 &&
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates. Must be [longitude, latitude]'
      }
    }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  facilities: {
    type: [String],
    enum: [
      'Cardio',
      'Strength Training',
      'Swimming Pool',
      'Yoga',
      'Sauna',
      'Zumba',
      'Pilates',
      '24/7 Access',
      'Functional',
      'Personal Training',
      'Crossfit',
      'Steam Room',
      'Spa',
      'Weights',
      'Classes',
      'Lockers',
      'Showers',
      'Body Building',
      'Pool'
    ],
    required: true
  },
  images: [{
    url: String,
    description: String,
    isFeatured: Boolean
  }],
  openingHours: {
    weekdays: {
      open: { type: String },
      close: { type: String }
    },
    weekends: {
      open: { type: String },
      close: { type: String }
    }
  },
  capacity: {
    type: Number,
    default: 0
  },
  availableSlots: [
    {
      date: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      available: { type: Boolean, default: true },
      trainer: { type: String }
    }
  ],
  trainerAvailable: {
    type: Boolean,
    default: false
  },
  pricing: {
    standard: {
      type: Number,
      required: true
    },
    premium: {
      type: Number,
      required: true
    }
  },
  slots: {
    type: [{
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      capacity: { type: Number, default: 10 },
      bookings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        bookedAt: { type: Date, default: Date.now }
      }]
    }],
    default: []
  },
  // contact: {
    phone: { type: String },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    website: String,
  // },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for geospatial queries
GymSchema.index({ location: '2dsphere' });

// Update the updatedAt field before saving
GymSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method for finding nearby gyms
GymSchema.statics.findNearby = function(coordinates, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

module.exports = mongoose.model('Gym', GymSchema);
