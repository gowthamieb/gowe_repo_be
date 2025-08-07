require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5600;

// Enhanced CORS configuration
const corsOptions_bk = {
  origin: function (origin, callback) {
    console.log('Request from origin:', origin);
    const allowedOrigins = [
      'http://localhost:3000',
      'http://192.168.29.13:3000',
      'http://192.168.29.13:5600',
      'https://gowe-repo-4g42tqilp-gowthamiebs-projects.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow if origin is undefined (non-browser tools) or in list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Error: ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
};

const corsOptions = {
  origin: function (origin, callback) {
    // Debugging
    console.log('Incoming origin:', origin);
    
    // List of allowed origins (add all possible frontend URLs)
    const allowedOrigins = [
      'http://localhost:3000',
      'http://192.168.29.13:3000',
      'http://192.168.29.13:5600',
      'https://gowe-repo-fe.vercel.app', // Add other production URLs
      'https://gowe-repo-d858ij4g2-gowthamiebs-projects.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Removes any undefined/null values

    // Allow requests with no origin (server-to-server, mobile apps, etc.)
    if (!origin) {
      console.warn('No origin detected - allowing request');
      return callback(null, true);
    }

    // Check if origin is allowed
    if (allowedOrigins.some(allowedOrigin => {
      return origin === allowedOrigin || 
             origin.startsWith(allowedOrigin.replace('https://', 'http://'));
    })) {
      console.log(`Allowed origin: ${origin}`);
      return callback(null, true);
    }

    console.error(`Blocked origin: ${origin}`);
    callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  exposedHeaders: ['x-auth-token'], // Headers browsers can access
  maxAge: 86400 // Cache preflight requests for 24 hours
};

// Apply CORS with these options
app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection with improved settings
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Models
const User = require('./models/User');
const Gym = require('./models/Gym');
const Slot = require('./models/Slot');
const Booking = require('./models/Booking');

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Register Route
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});


// Enhanced Auth Middleware
const auth_bk = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const auth = async (req, res, next) => {
  // Support both "Authorization: Bearer <token>" and "x-auth-token"
  const authHeader = req.header('Authorization');
  const tokenFromHeader =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.header('x-auth-token');

  if (!tokenFromHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Stripe Webhook Handler
app.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
  }

  res.json({ received: true });
});

async function handleSuccessfulPayment(paymentIntent) {
  try {
    const booking = await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { paymentStatus: 'succeeded', paymentDetails: paymentIntent },
      { new: true }
    ).populate('slot');

    if (booking?.slot) {
      await Slot.findByIdAndUpdate(booking.slot._id, { available: false });
    }
  } catch (err) {
    console.error('Success handler error:', err);
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { paymentStatus: 'failed' }
    );
  } catch (err) {
    console.error('Failure handler error:', err);
  }
}

// Get slots for a specific gym and date
app.get('/api/slots/:gymId', async (req, res) => {
  try {
    const { date } = req.query; // Expecting date in YYYY-MM-DD format
    const { gymId } = req.params;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    const slots = await Slot.find({
      gym: gymId,
      date: date,
      available: true
    }).populate('gym');

    res.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Enhanced Payment Routes
app.post('/api/create-payment-intent', auth, async (req, res) => {
  try {
    const { slotId, amount } = req.body;
    if (!slotId || !amount) return res.status(400).json({ message: 'Slot ID and amount are required' });

    const slot = await Slot.findById(slotId).populate('gym');
    if (!slot || !slot.available) return res.status(400).json({ message: 'Slot not available' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        slotId: slot._id.toString(),
        userId: req.user._id.toString(),
        gymId: slot.gym._id.toString()
      },
      description: `Booking for ${slot.gym.name} at ${slot.startTime}`
    });

    const booking = new Booking({
      user: req.user._id,
      slot: slot._id,
      gym: slot.gym._id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      paymentIntentId: paymentIntent.id,
      amountPaid: amount,
      paymentStatus: 'requires_payment_method'
    });

    await booking.save();

    res.json({ clientSecret: paymentIntent.client_secret, bookingId: booking._id });
  } catch (err) {
    console.error('Create intent error:', err);
    res.status(500).json({ message: 'Could not create payment intent' });
  }
});

// Confirm Booking
app.post('/api/confirm-booking', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ message: 'Booking ID is required' });

    const booking = await Booking.findById(bookingId).populate('user slot gym');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const paymentIntent = await stripe.paymentIntents.retrieve(booking.paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed', paymentStatus: paymentIntent.status });
    }

    booking.paymentStatus = 'succeeded';
    booking.paymentDetails = paymentIntent;
    await booking.save();

    await Slot.findByIdAndUpdate(booking.slot._id, { available: false });

    res.json({ message: 'Booking confirmed successfully', booking });
  } catch (err) {
    console.error('Confirm booking error:', err);
    res.status(500).json({ message: 'Error confirming booking' });
  }
});

// Make sure this is in your server.js file
app.post('/api/bookings', auth, async (req, res) => {
  try {
    const { slotId, paymentMethodId } = req.body;
    
    if (!slotId) {
      return res.status(400).json({ 
        success: false,
        message: 'Slot ID is required',
        field: 'slotId'
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({ 
        success: false,
        message: 'Payment method ID is required',
        field: 'paymentMethodId'
      });
    }

    // Find the slot
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      slot: slotId
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'You already booked this slot' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: slot.price * 100, // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `Booking for ${slot.gym.name} at ${slot.startTime}`,
      metadata: { slotId, userId: req.user.id }
    });

    // Create the booking
    const booking = new Booking({
      user: req.user.id,
      slot: slotId,
      gym: slot.gym,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      paymentIntentId: paymentIntent.id,
      amountPaid: slot.price,
      paymentStatus: paymentIntent.status
    });

    // Update slot availability
    slot.available = false;
    await slot.save();
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
      paymentIntent
    });

  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Booking failed' 
    });
  }
});

app.get('/api/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('gym')
      .populate('slot')
      .populate('user', '-password');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user owns the booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Error retrieving booking' });
  }
});

app.post('/api/request-refund/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('slot');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Check if refund is possible (within 24 hours before slot)
    const slotTime = new Date(`${booking.date}T${booking.startTime}`);
    const now = new Date();
    const hoursBeforeSlot = (slotTime - now) / (1000 * 60 * 60);

    if (hoursBeforeSlot < 24) {
      return res.status(400).json({ 
        message: 'Refund only possible at least 24 hours before the slot time'
      });
    }

    // Create refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
      reason: 'requested_by_customer'
    });

    // Update booking status
    booking.paymentStatus = 'refunded';
    booking.refundDetails = refund;
    await booking.save();

    // Make slot available again
    if (booking.slot) {
      await Slot.findByIdAndUpdate(booking.slot._id, { available: true });
    }

    res.json({ 
      message: 'Refund processed successfully',
      refund
    });
  } catch (err) {
    console.error('Refund processing error:', err);
    res.status(500).json({ message: 'Error processing refund' });
  }
});

// Gym routes
app.get('/api/gyms', async (req, res) => {
  try {
    const { location } = req.query;
    let query = {};

    if (location) {
      const regex = new RegExp(location, 'i'); // case-insensitive fuzzy match
      query = {
        $or: [
          { name: regex },
          { 'address.street': regex },
          { 'address.city': regex },
          { 'address.state': regex },
          { 'address.country': regex }
        ]
      };
    }

    const gyms = await Gym.find(query);
    res.json(gyms);
  } catch (err) {
    console.error('Error fetching gyms:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/gyms/:id', async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(gym);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Slot routes
app.get('/api/gyms/:gymId/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const slots = await Slot.find({
      gym: req.params.gymId,
      date: date, // use raw string match
      available: true
    });

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/gyms - Search gyms by location
app.get('/', async (req, res) => {
  try {
    const { location, radius = 5000 } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const [latitude, longitude] = location.split(',').map(Number);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid location coordinates' });
    }

    const gyms = await Gym.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius // in meters
        }
      }
    }).limit(20);

    res.json(gyms);
  } catch (error) {
    console.error('Error fetching gyms:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/gyms - Add new gym (for testing/development)
app.post('/', async (req, res) => {
  try {
    const gym = new Gym(req.body);
    await gym.save();
    res.status(201).json(gym);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.post('/api/bookings', auth, async (req, res) => {
//   try {
//     const { slotId, paymentIntentId, amountPaid } = req.body;

//     if (!slotId || !paymentIntentId || !amountPaid) {
//       return res.status(400).json({ message: 'Missing booking details' });
//     }

//     const slot = await Slot.findById(slotId).populate('gym');

//     if (!slot || !slot.available) {
//       return res.status(400).json({ message: 'Slot is not available' });
//     }

//     // Mark slot as booked
//     slot.available = false;
//     await slot.save();

//     const booking = new Booking({
//       user: req.user._id,
//       slot: slot._id,
//       gym: slot.gym._id,
//       date: slot.date,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       amountPaid,
//       paymentIntentId,
//       paymentStatus: 'succeeded' // you may dynamically set this based on Stripe webhook
//     });

//     await booking.save();

//     res.status(201).json({ message: 'Booking confirmed', booking });
//   } catch (error) {
//     console.error('Error confirming booking:', error.message);
//     res.status(500).json({ message: 'Failed to confirm booking' });
//   }
// });

app.get('/api/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('slot')
      .populate('gym')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});


// Start server with enhanced error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  server.close(() => process.exit(1));
});