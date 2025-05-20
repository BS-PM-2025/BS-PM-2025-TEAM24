const request = require("supertest");
const express = require("express");
const { authController } = require("../controllers/authController"); // ✅ fixed path
const User = require("../models/users"); // ✅ fixed path
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../models/users"); // ✅ fixed path
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.post("/api/auth/login", authController.login);

describe("POST /api/auth/login", () => {
  const mockUser = {
    _id: "1",
    name: "Sajed",
    email: "sajed@test.com",
    password: "hashed123",
    age: 30,
    gender: "male",
    isAdmin: true,
    isWorker: true,
    workType: "Electrician",
    city: "Tel Aviv",
    street: "Herzl",
    houseNumber: 10,
    description: "Expert",
    userCalls: [],
    workerCalls: []
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@email.com",
      password: "123456"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong user email please enter correct email");
  });

  it("should return 401 if password is incorrect", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compareSync.mockReturnValue(false);

    const res = await request(app).post("/api/auth/login").send({
      email: "sajed@test.com",
      password: "wrongpass"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid Password!");
  });

  it("should return 200 with token and user data if login is valid", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue("fake-token");

    const res = await request(app).post("/api/auth/login").send({
      email: "sajed@test.com",
      password: "correctpass"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("sajed@test.com");
    expect(res.body.accessToken).toBe("fake-token");
    expect(res.body.workerCalls).toEqual([]);
  });

  it("should return 500 if DB throws error", async () => {
    User.findOne.mockRejectedValue(new Error("DB fail"));

    const res = await request(app).post("/api/auth/login").send({
      email: "sajed@test.com",
      password: "any"
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Error getting user ");
  });
});
