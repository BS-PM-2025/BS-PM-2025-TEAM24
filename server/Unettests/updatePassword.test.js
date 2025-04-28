const request = require("supertest");
const express = require("express");
const { usersController } = require("../controllers/usersController");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

jest.mock("../models/users");
jest.mock("bcryptjs");

const app = express();
app.use(express.json());

// Middleware to simulate authentication (req.userId)
app.use((req, res, next) => {
  req.userId = "1234567890abcdef12345678";
  next();
});

app.put("/api/users/update-password", usersController.updatePassword);

describe("PUT /api/users/update-password", () => {
  const userId = "1234567890abcdef12345678";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).put("/api/users/update-password").send({
      currentPassword: "oldPass",
      newPassword: "newPass"
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 400 if current password is incorrect", async () => {
    const mockUser = {
      _id: userId,
      password: "hashedOldPass"
    };

    User.findById.mockResolvedValue(mockUser);
    bcrypt.compareSync.mockReturnValue(false);

    const res = await request(app).put("/api/users/update-password").send({
      currentPassword: "wrongPass",
      newPassword: "newPass"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Current password is incorrect");
  });

  it("should return 200 if password is updated successfully", async () => {
    const mockUser = {
      _id: userId,
      password: "hashedOldPass",
      save: jest.fn().mockResolvedValue(),
    };

    User.findById.mockResolvedValue(mockUser);
    bcrypt.compareSync.mockReturnValue(true);
    bcrypt.hashSync.mockReturnValue("newHashedPass");

    const res = await request(app).put("/api/users/update-password").send({
      currentPassword: "correctPass",
      newPassword: "newSecurePass"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password updated successfully");
    expect(mockUser.password).toBe("newHashedPass");
  });

  it("should return 500 if an error occurs", async () => {
    User.findById.mockRejectedValue(new Error("DB Fail"));

    const res = await request(app).put("/api/users/update-password").send({
      currentPassword: "any",
      newPassword: "newOne"
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });
});
