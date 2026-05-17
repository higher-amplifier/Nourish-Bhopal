const router = require('express').Router();
const { protect, allowRoles } = require('../middleware/auth');
const {
  getListings, getMyListings, getListing,
  createListing, confirmPickup, deleteListing,
} = require('../controllers/listingController');

router.get('/', getListings);
router.get('/my', protect, getMyListings);
router.get('/:id', getListing);
router.post('/', protect, allowRoles('donor'), createListing);
router.put('/:id/confirm', protect, allowRoles('donor'), confirmPickup);
router.delete('/:id', protect, allowRoles('donor'), deleteListing);

module.exports = router;
