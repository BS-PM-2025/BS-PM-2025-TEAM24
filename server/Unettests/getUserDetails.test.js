const request = require("supertest");
const express = require("express");
const { usersController } = require("../controllers/usersController");
const User = require("../models/users");

jest.mock("../models/users");

usersController.infoLogger = { info: jest.fn() };
usersController.errorLogger = { error: jest.fn() };

const app = express();
app.use(express.json());
app.get("/api/users/:id", usersController.getUserDetails);

describe("GET /api/users/:id", () => {
  const validUserId = "1234567890abcdef12345678";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return user if user is found", async () => {
    const mockUser = {
      _id: validUserId,
      name: "Mofed",
      email: "mofed@test.com",
      age: 30
    };

    User.findOne.mockResolvedValue(mockUser);

    const res = await request(app).get(`/api/users/${validUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Mofed");
    expect(res.body.email).toBe("mofed@test.com");
  });

  it("should return 400 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).get(`/api/users/${validUserId}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong user id please enter correct id");
  });

  it("should return 500 if db throws an error", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get(`/api/users/${validUserId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Error getting user ");
  });
});
