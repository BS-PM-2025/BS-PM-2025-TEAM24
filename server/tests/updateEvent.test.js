const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { infoLogger, errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.updateEvent', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { callID: 'CALL123' },
      body: {
        callType: 'Electricity',
        city: 'Nazareth',
        street: 'Al Quds St',
        houseNumber: 99,
        description: 'Short circuit',
        status: 'in progress'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('should update the event and return success', async () => {
    const mockEvent = {
      callID: 'CALL123',
      save: jest.fn().mockResolvedValue(),
      ...req.body
    };

    Events.findOne.mockResolvedValue(mockEvent);

    await eventsController.updateEvent(req, res);

    expect(Events.findOne).toHaveBeenCalledWith({ callID: 'CALL123' });
    expect(mockEvent.save).toHaveBeenCalled();
    expect(infoLogger.info).toHaveBeenCalledWith('Call updated successfully: CALL123');
    expect(res.json).toHaveBeenCalledWith({
      message: 'Call updated successfully',
      event: mockEvent
    });
  });

  it('should return 404 if event not found', async () => {
    Events.findOne.mockResolvedValue(null);

    await eventsController.updateEvent(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith('Call not found: CALL123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Call not found' });
  });

  it('should return 500 on error', async () => {
    Events.findOne.mockRejectedValue(new Error('DB error'));

    await eventsController.updateEvent(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error updating Call:'));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error updating Call',
      error: expect.any(Error)
    });
  });
});
