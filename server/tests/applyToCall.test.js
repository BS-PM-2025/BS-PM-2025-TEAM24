const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');
const { sendMail } = require('../utils/mailer');  // adjust path to your email utility
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../models/users');
jest.mock('../utils/mailer', () => ({
  sendMail: jest.fn()     // Mock sendMail as jest.fn()
}));
jest.mock('../logs/logs');

describe('eventsController.applyToCall', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'eventId123' },
      userId: 'workerId123'
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Events.findByIdAndUpdate.mockClear();
    User.findById.mockClear();
    sendMail.mockClear();             // Now this is safe to call because sendMail is jest.fn()
    errorLogger.error.mockClear();
    res.json.mockClear();
    res.status.mockClear();
  });


  it('should continue even if sendMail fails', async () => {
    Events.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn()
        .mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            createdBy: { name: 'CustomerName', email: 'customer@example.com' },
            callType: 'Plumbing',
            applicants: []
          })
        })
    });
    User.findById.mockResolvedValue({
      name: 'WorkerName',
      email: 'worker@example.com',
      workType: 'Plumber'
    });
    sendMail.mockRejectedValue(new Error('Mail failed'));

    console.error = jest.fn();

    await eventsController.applyToCall(req, res);

    expect(console.error).toHaveBeenCalledWith(
      '❌  Could not send notification mail:',
      expect.any(Error)
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Request sent and customer notified' });
  });

  it('should return 404 if event not found', async () => {
    Events.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      })
    });

    await eventsController.applyToCall(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Call not found' });
  });

  it('should handle unexpected errors', async () => {
    const error = new Error('DB error');
    Events.findByIdAndUpdate.mockImplementation(() => { throw error; });

    await eventsController.applyToCall(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(`Error applying to call: ${error}`);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error', error: error.message });
  });
});
