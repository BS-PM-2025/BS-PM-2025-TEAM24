// getUserStats.test.js
// Robust unit tests for getUserStats with path-agnostic mocks
//------------------------------------------------------------

// ------- Build a shared mock for the User model -------
const mockUserModel = {
  find: jest.fn(),
};

// Provide the mock under *all* common require paths so whichever one the
// controller uses is intercepted.  Add/adjust paths if your project differs.
jest.mock("../models/User", () => mockUserModel, { virtual: true });
jest.mock("../models/users", () => mockUserModel, { virtual: true });
jest.mock("../src/models/User", () => mockUserModel, { virtual: true });

// ------- Import the controller AFTER mocks -------
let getUserStats;
const controllerModule = require("../controllers/usersController");
if (typeof controllerModule.getUserStats === "function") {
  getUserStats = controllerModule.getUserStats;
} else if (
  controllerModule.usersController &&
  typeof controllerModule.usersController.getUserStats === "function"
) {
  getUserStats = controllerModule.usersController.getUserStats;
} else {
  throw new Error(
    "Cannot locate getUserStats export in ../controllers/usersController"
  );
}

// ------- Helper to mock Express res object -------
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getUserStats (unit)", () => {
  it("returns aggregated counts for each role", async () => {
    mockUserModel.find.mockResolvedValue([
      { isAdmin: true, isWorker: false },
      { isAdmin: false, isWorker: true },
      { isAdmin: false, isWorker: false },
      { isAdmin: false, isWorker: true },
    ]);

    const req = {};
    const res = buildRes();

    await getUserStats(req, res);

    expect(mockUserModel.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      total: 4,
      admins: 1,
      workers: 2,
      customers: 1,
    });
  });

  it("returns 500 when User.find throws", async () => {
    mockUserModel.find.mockRejectedValue(new Error("DB failure"));

    const req = {};
    const res = buildRes();

    await getUserStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve user stats" });
  });
});
