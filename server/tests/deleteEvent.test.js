const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { infoLogger, errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.deleteEvent', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { id: 'CALL123' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('should delete event and return success message', async () => {
    Events.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await eventsController.deleteEvent(req, res);

    expect(Events.deleteOne).toHaveBeenCalledWith({ callID: 'CALL123' });
    expect(infoLogger.info).toHaveBeenCalledWith('Event deleted successfully: CALL123');
    expect(res.json).toHaveBeenCalledWith({ message: 'Event deleted successfully' });
  });

  it('should return 404 if event is not found', async () => {
    Events.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await eventsController.deleteEvent(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith('Event not found: CALL123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
  });

  it('should return 500 on error', async () => {
    Events.deleteOne.mockRejectedValue(new Error('DB error'));

    await eventsController.deleteEvent(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error deleting event'));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error deleting event',
      error: expect.any(Error)
    });
  });
});
