const router = require('express').Router();
const { protect, allowRoles } = require('../middleware/auth');
const { claimListing, getMyClaims, unclaimListing } = require('../controllers/claimController');

router.post('/:listingId', protect, allowRoles('volunteer', 'ngo'), claimListing);
router.get('/mine', protect, getMyClaims);
router.delete('/:listingId', protect, allowRoles('volunteer', 'ngo'), unclaimListing);

module.exports = router;
