const mongoose = require('mongoose');
const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.unapplyEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'someEventId' },
      userId: 'user123'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Events.findOneAndUpdate.mockClear();
    errorLogger.error.mockClear();
  });

  it('should unapply user successfully and return message', async () => {
    Events.findOneAndUpdate.mockResolvedValue({ _id: 'someEventId' });

    await eventsController.unapply(req, res);

    // Check filter logic: id is valid ObjectId? If not, uses callID
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const expectedFilter = isValidObjectId
      ? { _id: req.params.id }
      : { callID: req.params.id };

    expect(Events.findOneAndUpdate).toHaveBeenCalledWith(
      expectedFilter,
      {
        $pull: {
          applicants: req.userId,
          approvedWorkers: req.userId
        }
      },
      { new: true }
    );

    expect(res.json).toHaveBeenCalledWith({ message: 'Unapplied successfully' });
  });

  it('should return 404 if event not found', async () => {
    Events.findOneAndUpdate.mockResolvedValue(null);

    await eventsController.unapply(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Call not found' });
  });

  it('should log error and return 500 on failure', async () => {
    const error = new Error('DB failure');
    Events.findOneAndUpdate.mockRejectedValue(error);

    await eventsController.unapply(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(`Error unapplying: ${error}`);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error', error: error.message });
  });
});
