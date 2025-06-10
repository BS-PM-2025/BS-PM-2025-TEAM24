// server/tests/applyToCall.int.test.js

const request = require('supertest');
const express = require('express');
const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const User = require('../models/users');
const sendMail = require('../utils/mailer');
const { errorLogger } = require('../logs/logs');
const authJwt = require('../middlewares/authJwt');

jest.mock('../models/events');
jest.mock('../models/users');
jest.mock('../utils/mailer');
jest.mock('../logs/logs');
jest.mock('../middlewares/authJwt');

const app = express();
app.use(express.json());

// Mock authentication middleware to set req.userId
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockWorkerId';
  next();
});

// Route to test
app.put('/api/events/:id/apply', authJwt.verifyToken, eventsController.applyToCall);

describe('PUT /api/events/:id/apply (applyToCall)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add worker to applicants, send notification email, and respond success', async () => {
    const mockEvent = {
      _id: 'event123',
      callType: 'Plumbing',
      createdBy: { name: 'Customer Name', email: 'customer@example.com' },
      applicants: [{ name: 'Applicant One', email: 'applicant1@example.com' }],
      populate: jest.fn().mockReturnThis(),
    };

    const mockWorker = { name: 'Worker Name', email: 'worker@example.com', workType: 'Plumber' };

    Events.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn()
        .mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockEvent),
        }),
    });

    User.findById.mockResolvedValue(mockWorker);

    sendMail.mockResolvedValue();

    const res = await request(app)
      .put('/api/events/event123/apply')
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Request sent and customer notified' });

    expect(Events.findByIdAndUpdate).toHaveBeenCalledWith(
      'event123',
      { $addToSet: { applicants: 'mockWorkerId' } },
      { new: true }
    );

    expect(User.findById).toHaveBeenCalledWith('mockWorkerId', 'name email workType');

    expect(sendMail).toHaveBeenCalledWith(
      'customer@example.com',
      expect.stringContaining('New applicant for your Plumbing call'),
      expect.stringContaining('Worker Name')
    );
  });

  it('should respond 404 if event not found', async () => {
    Events.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    const res = await request(app)
      .put('/api/events/fakeEvent/apply')
      .send();

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Call not found' });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it('should log mail error but still succeed if sending mail fails', async () => {
    const mockEvent = {
      _id: 'event123',
      callType: 'Plumbing',
      createdBy: { name: 'Customer Name', email: 'customer@example.com' },
      applicants: [],
      populate: jest.fn().mockReturnThis(),
    };

    const mockWorker = { name: 'Worker Name', email: 'worker@example.com', workType: 'Plumber' };

    Events.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEvent),
      }),
    });

    User.findById.mockResolvedValue(mockWorker);

    sendMail.mockRejectedValue(new Error('Mail failure'));

    console.error = jest.fn();

    const res = await request(app)
      .put('/api/events/event123/apply')
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Request sent and customer notified' });

    expect(console.error).toHaveBeenCalledWith(
      '❌  Could not send notification mail:',
      expect.any(Error)
    );
  });

  it('should handle unexpected errors with 500', async () => {
    const error = new Error('DB failure');
    Events.findByIdAndUpdate.mockImplementation(() => { throw error; });

    const res = await request(app)
      .put('/api/events/event123/apply')
      .send();

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: 'Server error',
      error: error.message,
    });

    expect(errorLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error applying to call:'));
  });
});
