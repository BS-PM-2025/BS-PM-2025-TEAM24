const { ratingsController } = require("../controllers/ratingsController");
const Rating = require("../models/ratings");
const { infoLogger, errorLogger } = require("../logs/logs");

jest.mock("../models/ratings");
jest.mock("../logs/logs");

describe("Unit Test: deleteRating", () => {
  const req = { params: { id: "123abc" } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should delete rating successfully", async () => {
    const fakeRating = { _id: "123abc" };
    Rating.findById.mockResolvedValue(fakeRating);
    Rating.findByIdAndDelete.mockResolvedValue(fakeRating);

    await ratingsController.deleteRating(req, res);

    expect(Rating.findById).toHaveBeenCalledWith("123abc");
    expect(Rating.findByIdAndDelete).toHaveBeenCalledWith("123abc");
    expect(infoLogger.info).toHaveBeenCalledWith("Rating deleted with ID: 123abc");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Rating deleted successfully" });
  });

  it("❌ should return 404 if rating not found", async () => {
    Rating.findById.mockResolvedValue(null);

    await ratingsController.deleteRating(req, res);

    expect(Rating.findById).toHaveBeenCalledWith("123abc");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Rating not found" });
  });

  it("❌ should return 500 on DB error", async () => {
    Rating.findById.mockRejectedValue(new Error("DB error"));

    await ratingsController.deleteRating(req, res);

    expect(errorLogger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
