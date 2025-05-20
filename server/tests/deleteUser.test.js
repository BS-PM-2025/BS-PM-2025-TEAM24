const { usersController } = require("../controllers/usersController");
const User = require("../models/users");

jest.mock("../models/users");

describe("Unit Test: deleteUser", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("✅ should delete user successfully", async () => {
    User.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await usersController.deleteUser(req, res);

    expect(User.deleteOne).toHaveBeenCalledWith({ _id: "123" });
    expect(res.json).toHaveBeenCalledWith({
      message: "Deleting user no:123 is successfully",
    });
  });

  it("❌ should return 400 if user not found", async () => {
    User.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await usersController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "user no:123 does not exists",
    });
  });

  
});
