const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const { infoLogger, errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../logs/logs');

describe('eventsController.getEvents', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('should fetch and return all events sorted by date desc', async () => {
    const mockEvents = [
      { callID: '2', date: new Date('2024-05-01') },
      { callID: '1', date: new Date('2024-04-01') }
    ];

    const sortMock = jest.fn().mockResolvedValue(mockEvents);
    Events.find.mockReturnValue({ sort: sortMock });

    await eventsController.getEvents(req, res);

    expect(Events.find).toHaveBeenCalledWith({});
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(res.json).toHaveBeenCalledWith(mockEvents);
    expect(infoLogger.info).toHaveBeenCalledWith('Fetched all Calls');
  });

  it('should return 500 if fetching events fails', async () => {
    const sortMock = jest.fn().mockRejectedValue(new Error('DB error'));
    Events.find.mockReturnValue({ sort: sortMock });

    await eventsController.getEvents(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error fetching Calls:'));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching Calls',
      error: expect.any(Error)
    });
  });
});
