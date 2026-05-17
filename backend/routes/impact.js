const router = require('express').Router();
const { getImpact } = require('../controllers/impactController');

router.get('/', getImpact);

module.exports = router;
