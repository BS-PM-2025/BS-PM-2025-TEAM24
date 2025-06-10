// server/tests/unapplyEvent.int.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { eventsController } = require('../controllers/eventsController');
const Events = require('../models/events');
const authJwt = require('../middlewares/authJwt');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/events');
jest.mock('../middlewares/authJwt');
jest.mock('../logs/logs');

const app = express();
app.use(express.json());

// Mock auth middleware to set req.userId
authJwt.verifyToken.mockImplementation((req, res, next) => {
  req.userId = 'mockUserId';
  next();
});

app.put('/api/events/:id/unapply', authJwt.verifyToken, eventsController.unapply);

describe('PUT /api/events/:id/unapply (unapply)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should return 404 if event not found', async () => {
    Events.findOneAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/events/unknownEvent/unapply')
      .send();

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Call not found' });
  });

  it('should handle errors and return 500', async () => {
    const error = new Error('DB failure');
    Events.findOneAndUpdate.mockRejectedValue(error);

    const res = await request(app)
      .put('/api/events/eventId123/unapply')
      .send();

    expect(errorLogger.error).toHaveBeenCalledWith(`Error unapplying: ${error}`);
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Server error');
    expect(res.body).toHaveProperty('error', 'DB failure');
  });
});
