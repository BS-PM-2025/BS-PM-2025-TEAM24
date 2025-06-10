const { getWorkerAverage } = require('../controllers/workRateController');
const WorkRate = require('../models/workRate');
const mongoose = require('mongoose');

jest.mock('../models/workRate');

describe('getWorkerAverage', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { workerId: new mongoose.Types.ObjectId().toString() } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should return average and count if found', async () => {
    WorkRate.aggregate.mockResolvedValue([{ avg: 4.5, count: 10 }]);

    await getWorkerAverage(req, res);

    expect(WorkRate.aggregate).toHaveBeenCalledWith([
      { $match: { workerId: expect.any(mongoose.Types.ObjectId) } },
      { $group: { _id: null, avg: { $avg: '$rate' }, count: { $sum: 1 } } }
    ]);
    expect(res.json).toHaveBeenCalledWith({ average: 4.5, count: 10 });
  });

  it('should return 0 average and count if no ratings', async () => {
    WorkRate.aggregate.mockResolvedValue([]);

    await getWorkerAverage(req, res);

    expect(res.json).toHaveBeenCalledWith({ average: 0, count: 0 });
  });

  it('should return 400 for invalid workerId', async () => {
    req.params.workerId = 'notavalidid';

    await getWorkerAverage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid workerId' });
  });

  it('should handle errors and return 500', async () => {
    WorkRate.aggregate.mockRejectedValue(new Error('DB Error'));

    await getWorkerAverage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB Error' });
  });
});
