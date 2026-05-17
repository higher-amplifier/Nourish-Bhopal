const Listing = require('../models/Listing');

// POST /api/claims/:listingId  - volunteer/ngo claims a listing
const claimListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'available')
      return res.status(400).json({ message: 'Listing is no longer available' });
    if (listing.donor.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot claim your own listing' });

    listing.status = 'claimed';
    listing.claimedBy = req.user._id;
    listing.claimedAt = new Date();
    await listing.save();
    await listing.populate('donor', 'name address phone');
    await listing.populate('claimedBy', 'name phone');

    req.io.emit('listing:claimed', listing);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/claims/mine  - volunteer's claimed listings
const getMyClaims = async (req, res) => {
  try {
    const listings = await Listing.find({ claimedBy: req.user._id })
      .populate('donor', 'name address phone')
      .sort({ claimedAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/claims/:listingId  - volunteer unclaims
const unclaimListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (!listing.claimedBy || listing.claimedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'You have not claimed this' });

    listing.status = 'available';
    listing.claimedBy = null;
    listing.claimedAt = null;
    await listing.save();

    req.io.emit('listing:unclaimed', { id: listing._id });
    res.json({ message: 'Unclaimed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { claimListing, getMyClaims, unclaimListing };
