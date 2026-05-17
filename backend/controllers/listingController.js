const Listing = require('../models/Listing');
const ImpactLog = require('../models/ImpactLog');
const User = require('../models/User');

// GET /api/listings?lat=&lng=&radius=  (radius in km, default 10)
const getListings = async (req, res) => {
  try {
    const { lat, lng, radius = 10, status } = req.query;
    const filter = {};

    if (status) filter.status = status;
    else filter.status = 'available';

    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000,
        },
      };
    }

    const listings = await Listing.find(filter)
      .populate('donor', 'name address phone')
      .populate('claimedBy', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/listings/my  - donor's own listings
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ donor: req.user._id })
      .populate('claimedBy', 'name phone')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/listings/:id
const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('donor', 'name address phone email')
      .populate('claimedBy', 'name phone');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/listings
const createListing = async (req, res) => {
  try {
    const { title, description, quantity, unit, foodType, address, lat, lng, expiresInHours } = req.body;

    const expiresAt = new Date(Date.now() + (expiresInHours || 2) * 60 * 60 * 1000);

    const listing = await Listing.create({
      title, description, quantity, unit, foodType, address,
      donor: req.user._id,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      expiresAt,
    });

    await listing.populate('donor', 'name address phone');

    // Emit to all connected clients
    req.io.emit('listing:new', listing);

    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/listings/:id/confirm  - donor confirms pickup done
const confirmPickup = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.donor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your listing' });
    if (listing.status !== 'claimed')
      return res.status(400).json({ message: 'Listing not in claimed state' });

    listing.status = 'completed';
    listing.completedAt = new Date();
    await listing.save();

    // Log impact (1 meal ≈ 0.5kg food, 2.5kg CO2 per kg)
    const kgSaved = listing.unit === 'kg' ? listing.quantity : listing.quantity * 0.5;
    await ImpactLog.create({
      listing: listing._id,
      volunteer: listing.claimedBy,
      donor: listing.donor,
      mealsCount: listing.unit === 'meals' ? listing.quantity : listing.quantity * 2,
      kgSaved,
      co2Saved: parseFloat((kgSaved * 2.5).toFixed(2)),
    });

    // Update volunteer stats + badges
    if (listing.claimedBy) {
      const vol = await User.findById(listing.claimedBy);
      vol.mealsRescued += listing.quantity;
      const badges = new Set(vol.badges);
      if (vol.mealsRescued >= 5 && !badges.has('First Five')) badges.add('First Five');
      if (vol.mealsRescued >= 50 && !badges.has('Hunger Hero')) badges.add('Hunger Hero');
      if (vol.mealsRescued >= 200 && !badges.has('Food Guardian')) badges.add('Food Guardian');
      vol.badges = [...badges];
      await vol.save();
    }

    req.io.emit('listing:completed', { id: listing._id });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/listings/:id
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.donor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your listing' });
    await listing.deleteOne();
    req.io.emit('listing:deleted', { id: req.params.id });
    res.json({ message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getListings, getMyListings, getListing, createListing, confirmPickup, deleteListing };
