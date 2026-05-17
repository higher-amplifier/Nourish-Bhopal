const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['meals', 'kg', 'packets'], default: 'meals' },
  foodType: { type: String, enum: ['cooked', 'packaged', 'raw', 'bakery'], default: 'cooked' },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'claimed', 'completed', 'expired'],
    default: 'available',
  },
  expiresAt: { type: Date, required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  claimedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

listingSchema.index({ location: '2dsphere' });
listingSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model('Listing', listingSchema);
