const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');
const { sendMail } = require('../utils/mailer');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../models/users');
jest.mock('../utils/mailer', () => ({
  sendMail: jest.fn()
}));
jest.mock('../logs/logs', () => ({
  errorLogger: { error: jest.fn() }
}));

describe('eventsController.completeCall', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'callId123' },
      userId: 'workerId123'
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    Events.findByIdAndUpdate.mockClear();
    User.findById.mockClear();
    sendMail.mockClear();
    errorLogger.error.mockClear();
    res.json.mockClear();
    res.status.mockClear();
  });

  it('should handle missing call with 404', async () => {
    Events.findByIdAndUpdate.mockResolvedValue(null);

    await eventsController.completeCall(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Call not found' });
  });

  it('should log error and return 500 on unexpected error', async () => {
    const error = new Error('DB error');
    Events.findByIdAndUpdate.mockRejectedValue(error);

    await eventsController.completeCall(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(`completeCall error: ${error}`);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });

  it('should still return updated call if sendMail fails', async () => {
    const mockCall = {
      _id: 'callId123',
      createdBy: 'customerId123',
      callType: 'Plumbing',
      callID: '12345'
    };
    const mockCustomer = { name: 'CustomerName', email: 'customer@example.com' };
    const mockWorker = { name: 'WorkerName' };

    Events.findByIdAndUpdate.mockResolvedValue(mockCall);
    User.findById
      .mockResolvedValueOnce(mockCustomer)
      .mockResolvedValueOnce(mockWorker);
    sendMail.mockRejectedValue(new Error('Mail failed'));

    await eventsController.completeCall(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith(expect.stringContaining('Could not send “job done” e-mail:'));
    expect(res.json).toHaveBeenCalledWith(mockCall);
  });
});
