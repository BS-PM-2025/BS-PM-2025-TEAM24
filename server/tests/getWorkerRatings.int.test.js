const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const WorkRate = require('../models/workRate');

jest.mock('../middlewares/authJwt', () => ({
  verifyToken: (req, res, next) => {
    req.userId = '507f191e810c19729de860ea'; // fixed user id for tests
    next();
  }
}));

jest.setTimeout(60000);

describe('GET /api/workRates/:workerId', () => {
  let mongoServer;
  let workerId, customerId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    workerId = new mongoose.Types.ObjectId();
    customerId = new mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await WorkRate.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should return ratings for the worker sorted newest first', async () => {
    await WorkRate.create({
      workerId,
      customerId,
      customerName: 'Alice',
      rate: 5,
      feedback: 'Great',
      createdAt: new Date('2024-06-01T10:00:00Z')
    });
    await WorkRate.create({
      workerId,
      customerId,
      customerName: 'Bob',
      rate: 3,
      feedback: 'Okay',
      createdAt: new Date('2024-06-02T10:00:00Z')
    });

    const res = await request(app)
      .get(`/api/workRates/${workerId.toString()}`)
      .expect(200);

    expect(res.body).toHaveLength(2);
    expect(res.body[0].customerName).toBe('Bob');
    expect(res.body[1].customerName).toBe('Alice');
  });

  it('should return empty array if no ratings for the worker', async () => {
    const otherWorkerId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/workRates/${otherWorkerId.toString()}`)
      .expect(200);

    expect(res.body).toEqual([]);
  });
});
