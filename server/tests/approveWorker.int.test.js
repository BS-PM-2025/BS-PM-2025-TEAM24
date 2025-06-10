// server/tests/approveWorker.int.test.js

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

// Mock authJwt to set req.userId (if needed for your route)
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockUserId';
  next();
});

app.put('/api/events/:id/approve/:workerId', authJwt.verifyToken, eventsController.approveWorker);

describe('PUT /api/events/:id/approve/:workerId (approveWorker)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should return 404 if event not found', async () => {
    Events.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/events/fakeEvent/approve/fakeWorker')
      .send();

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Event not found' });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('should log error and return 500 on unexpected errors', async () => {
    const error = new Error('DB error');
    Events.findByIdAndUpdate.mockRejectedValue(error);

    const res = await request(app)
      .put('/api/events/event123/approve/worker123')
      .send();

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: 'Server error',
      error: error.message
    });
    expect(errorLogger.error).toHaveBeenCalledWith(`Error approving worker: ${error}`);
  });

  it('should log mail error but still succeed if sendMail fails', async () => {
    const mockEvent = {
      _id: 'event123',
      callType: 'Electrical',
      callID: 'CALL123',
      createdBy: 'customer123',
      status: 'in progress',
      applicants: [],
      assignedWorker: 'worker123',
      rated: false
    };
    const mockWorker = { name: 'Worker Name', email: 'worker@example.com', select: jest.fn().mockReturnThis() };
    const mockCustomer = { name: 'Customer Name', email: 'customer@example.com', select: jest.fn().mockReturnThis() };

    Events.findByIdAndUpdate.mockResolvedValue(mockEvent);
    User.findById
      .mockResolvedValueOnce(mockWorker)
      .mockResolvedValueOnce(mockCustomer);

    sendMail.mockRejectedValue(new Error('Mail fail'));

    const res = await request(app)
      .put('/api/events/event123/approve/worker123')
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: 'Worker approved & event set to "in progress"',
      event: mockEvent
    });
    expect(errorLogger.error).toHaveBeenCalledWith(expect.stringContaining('Could not send approval mail:'));
  });
});
