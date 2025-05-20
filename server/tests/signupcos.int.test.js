jest.setTimeout(20000);
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: signupcos", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("✅ should register a new customer successfully", async () => {
    const res = await request(app).post("/api/auth/signupcos").send({
      name: "New Customer",
      email: "customer@example.com",
      age: 25,
      gender: "Male",
      password: "password123",
      city: "Haifa",
      street: "Main Street",
      houseNumber: 12,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("email", "customer@example.com");

    const createdUser = await User.findOne({ email: "customer@example.com" });
    expect(createdUser).not.toBeNull();
    expect(createdUser.isWorker).toBe(false);
    expect(createdUser.isAdmin).toBe(false);
    expect(createdUser.workType).toBe("None");
  });

  it("❌ should return 400 for missing parameters", async () => {
    const res = await request(app).post("/api/auth/signupcos").send({
      email: "incomplete@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing Parameters Please send all Parameters");
  });

  it("❌ should return 400 if email already exists", async () => {
    // Pre-create a user
    await User.create({
      name: "Existing User",
      email: "existing@example.com",
      age: 30,
      gender: "Female",
      password: bcrypt.hashSync("existing123", 8),
      city: "Nazareth",
      street: "Old Street",
      houseNumber: 5,
      isWorker: false,
      isAdmin: false,
      workType: "None",
    });

    const res = await request(app).post("/api/auth/signupcos").send({
      name: "Another User",
      email: "existing@example.com",
      age: 22,
      gender: "Female",
      password: "newpass",
      city: "Nazareth",
      street: "Old Street",
      houseNumber: 5,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("this email is already exists");
  });
});
