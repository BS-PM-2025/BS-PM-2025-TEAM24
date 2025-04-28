const request = require("supertest");
const express = require("express");
const { authController } = require("../controllers/authController");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

jest.mock("../models/users");
jest.mock("bcryptjs");

authController.errorLogger = { error: jest.fn() };

const app = express();
app.use(express.json());
app.post("/api/auth/reset-password", authController.resetPassword);

describe("POST /api/auth/reset-password", () => {
  const validBody = {
    email: "test@example.com",
    otp: "ABC123",
    newPassword: "newSecurePass"
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if any field is missing", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({
      email: "test@example.com"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 400 if OTP is invalid or expired", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/reset-password").send(validBody);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid or expired OTP");
  });

  it("should return 200 if password is updated successfully", async () => {
    const mockUser = {
      email: validBody.email,
      resetPasswordToken: validBody.otp,
      resetPasswordExpires: Date.now() + 10000,
      save: jest.fn().mockResolvedValue()
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.hashSync.mockReturnValue("hashedNewPassword");

    const res = await request(app).post("/api/auth/reset-password").send(validBody);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password has been updated");
    expect(mockUser.password).toBe("hashedNewPassword");
    expect(mockUser.resetPasswordToken).toBeUndefined();
    expect(mockUser.resetPasswordExpires).toBeUndefined();
  });

  it("should return 500 if DB throws an error", async () => {
    User.findOne.mockRejectedValue(new Error("DB fail"));

    const res = await request(app).post("/api/auth/reset-password").send(validBody);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Error resetting password");
  });
});
