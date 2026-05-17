const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['donor', 'volunteer', 'ngo'], required: true },
  phone: { type: String },
  address: { type: String },
  // GeoJSON for location-based queries
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [77.4284, 23.2130] }, // Jaipur default
  },
  notificationRadius: { type: Number, default: 5000 }, // metres
  // Gamification
  mealsRescued: { type: Number, default: 0 },
  badges: [{ type: String }],
  streak: { type: Number, default: 0 },
  lastPickup: { type: Date },
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
