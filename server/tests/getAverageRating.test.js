const { ratingsController } = require('../controllers/ratingsController');
const Rating = require('../models/ratings');
const { errorLogger } = require('../logs/logs');

jest.mock('../models/ratings');
jest.mock('../logs/logs');

describe('ratingsController.getAverageRating', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Rating.aggregate.mockClear();
    errorLogger.error.mockClear();
  });

  it('should return average rating rounded to 1 decimal', async () => {
    Rating.aggregate.mockResolvedValue([{ avgRating: 4.3333 }]);

    await ratingsController.getAverageRating(req, res);

    expect(Rating.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: null,
          avgRating: { $avg: { $toDouble: "$rating" } }
        }
      }
    ]);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ average: '4.3' });
  });

  it('should return 0 if no ratings found', async () => {
    Rating.aggregate.mockResolvedValue([]);

    await ratingsController.getAverageRating(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ average: '0.0' });
  });

  it('should handle errors and return 500', async () => {
    const error = new Error('DB error');
    Rating.aggregate.mockRejectedValue(error);

    await ratingsController.getAverageRating(req, res);

    expect(errorLogger.error).toHaveBeenCalledWith('Failed to calculate average rating:', error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
