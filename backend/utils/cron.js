const cron = require('node-cron');
const Listing = require('../models/Listing');

// Runs every 5 minutes — marks listings as expired past their window
cron.schedule('*/5 * * * *', async () => {
  try {
    const result = await Listing.updateMany(
      { status: 'available', expiresAt: { $lt: new Date() } },
      { $set: { status: 'expired' } }
    );
    if (result.modifiedCount > 0)
      console.log(`[Cron] Expired ${result.modifiedCount} listing(s)`);
  } catch (err) {
    console.error('[Cron] Error expiring listings:', err.message);
  }
});

console.log('[Cron] Auto-expiry scheduler started');
