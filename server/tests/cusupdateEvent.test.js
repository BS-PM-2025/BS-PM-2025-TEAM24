const mongoose = require('mongoose');
const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.cusupdateEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'eventId123' },
      userId: 'userId123',
      body: {
        callType: 'Repair',
        city: 'New City',
        street: 'Main St',
        houseNumber: '42',
        description: 'Fix plumbing',
        date: '2025-06-08'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Events.findOneAndUpdate.mockClear();
    errorLogger.error.mockClear();
  });

  it('should update event for user and return updated event', async () => {
    const updatedEvent = { _id: req.params.id, ...req.body, createdBy: req.userId };
    Events.findOneAndUpdate.mockResolvedValue(updatedEvent);

    await eventsController.cusupdateEvent(req, res);

    expect(Events.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: req.params.id, createdBy: req.userId },
      { $set: req.body },
      { new: true }
    );

    expect(res.json).toHaveBeenCalledWith({ message: 'Updated', event: updatedEvent });
  });

  it('should return 404 if event not found', async () => {
    Events.findOneAndUpdate.mockResolvedValue(null);

    await eventsController.cusupdateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Call not found' });
  });

  it('should log error and return 500 on failure', async () => {
    const error = new Error('DB failure');
    Events.findOneAndUpdate.mockRejectedValue(error);

    await eventsController.cusupdateEvent(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(`Update error: ${error}`);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
