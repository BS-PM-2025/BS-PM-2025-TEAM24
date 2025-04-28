const request = require("supertest");
const express = require("express");
const { usersController } = require("../controllers/usersController");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

jest.mock("../models/users");
jest.mock("bcryptjs");

usersController.infoLogger = { info: jest.fn() };
usersController.errorLogger = { error: jest.fn() };

const app = express();
app.use(express.json());
app.put("/api/users/:id", usersController.editUserDetails);

describe("PUT /api/users/:id", () => {
  const userId = "1234567890abcdef12345678";
  const mockUser = {
    _id: userId,
    name: "Mofed",
    email: "mofed@test.com",
    password: "hashedOldPassword"
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update user successfully when no password is involved", async () => {
    User.findOne.mockResolvedValue(mockUser);
    User.updateOne.mockResolvedValue({ matchedCount: 1 });

    const res = await request(app).put(`/api/users/${userId}`).send({
      name: "Updated Name"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("successfully");
  });

  it("should return 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).put(`/api/users/${userId}`).send({
      name: "Any"
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 400 if old password is incorrect", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).put(`/api/users/${userId}`).send({
      oldPassword: "wrongPassword",
      name: "Any"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Old password is incorrect");
  });

  it("should hash new password if old password is correct", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hashSync.mockReturnValue("hashedNewPassword");
    User.updateOne.mockResolvedValue({ matchedCount: 1 });

    const res = await request(app).put(`/api/users/${userId}`).send({
      oldPassword: "correctOldPassword",
      password: "newPassword"
    });

    expect(res.statusCode).toBe(200);
    expect(bcrypt.hashSync).toHaveBeenCalledWith("newPassword", 8);
    expect(res.body.message).toContain("successfully");
  });

  it("should return 400 if update matchedCount is 0", async () => {
    User.findOne.mockResolvedValue(mockUser);
    User.updateOne.mockResolvedValue({ matchedCount: 0 });

    const res = await request(app).put(`/api/users/${userId}`).send({
      name: "NoUpdate"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No matching user found to update");
  });

  it("should return 500 if DB throws error", async () => {
    User.findOne.mockRejectedValue(new Error("DB fail"));

    const res = await request(app).put(`/api/users/${userId}`).send({
      name: "ErrorCase"
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Error updating user details");
  });
});
