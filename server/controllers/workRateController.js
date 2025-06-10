const WorkRate = require('../models/workRate');
const { Types } = require('mongoose');
const Events    = require('../models/events');
const mongoose  = require('mongoose');


/* GET /api/workRates/:workerId  → all ratings for a worker */
exports.getWorkerRatings = async (req, res) => {
  try {
    const ratings = await WorkRate.find({ workerId: req.params.workerId })
                                  .sort({ createdAt: -1 });    // newest first
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* (optional) GET /api/workRates/avg/:workerId → average stars only */
exports.getWorkerAverage = async (req, res) => {
  try {
      const workerId = Types.ObjectId.isValid(req.params.workerId)
                      ? new Types.ObjectId(req.params.workerId)
                      : null;

    if (!workerId) {
      return res.status(400).json({ message: 'Invalid workerId' });
    }

    const [agg] = await WorkRate.aggregate([
      { $match: { workerId } },                                // ← ObjectId
      { $group: { _id: null,
                  avg  : { $avg: '$rate' },                    // numeric
                  count: { $sum: 1 } } }
    ]);
    res.json({ average: agg?.avg ?? 0, count: agg?.count ?? 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
