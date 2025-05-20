const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.getEventsByType', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { callType: 'Plumbing' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('should return events if found by callType', async () => {
    const mockEvents = [
      { callID: '1', callType: 'Plumbing' },
      { callID: '2', callType: 'Plumbing' }
    ];

    Events.find.mockResolvedValue(mockEvents);

    await eventsController.getEventsByType(req, res);

    expect(Events.find).toHaveBeenCalledWith({ callType: 'Plumbing' });
    expect(res.json).toHaveBeenCalledWith(mockEvents);
  });

  it('should return 404 if no events are found', async () => {
    Events.find.mockResolvedValue([]);

    await eventsController.getEventsByType(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith('No events found for call type: Plumbing');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No calls found for this type' });
  });

  it('should return 500 if an error occurs', async () => {
    Events.find.mockRejectedValue(new Error('DB error'));

    await eventsController.getEventsByType(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error fetching calls by type:'));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching calls',
      error: expect.any(Error)
    });
  });
});
