const mongoose = require('mongoose');

const impactLogSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mealsCount: { type: Number, default: 0 },
  kgSaved: { type: Number, default: 0 },
  // Average 2.5kg CO2 saved per kg of food not wasted
  co2Saved: { type: Number, default: 0 },
  city: { type: String, default: 'Jaipur' },
}, { timestamps: true });

module.exports = mongoose.model('ImpactLog', impactLogSchema);
