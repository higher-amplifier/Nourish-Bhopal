const ImpactLog = require('../models/ImpactLog');
const User = require('../models/User');

// GET /api/impact  - city-wide stats
const getImpact = async (req, res) => {
  try {
    const logs = await ImpactLog.find();
    const totalMeals = logs.reduce((s, l) => s + l.mealsCount, 0);
    const totalKg = logs.reduce((s, l) => s + l.kgSaved, 0);
    const totalCO2 = logs.reduce((s, l) => s + l.co2Saved, 0);

    const leaderboard = await User.find({ role: 'volunteer', mealsRescued: { $gt: 0 } })
      .select('name mealsRescued badges')
      .sort({ mealsRescued: -1 })
      .limit(10);

    res.json({
      totalMeals,
      totalKg: parseFloat(totalKg.toFixed(1)),
      totalCO2: parseFloat(totalCO2.toFixed(1)),
      totalRescues: logs.length,
      leaderboard,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getImpact };
