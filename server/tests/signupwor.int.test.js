jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: signupwor", () => {
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

  it("✅ should register a new worker successfully", async () => {
    const res = await request(app).post("/api/auth/signupwor").send({
      name: "Worker One",
      email: "worker1@example.com",
      age: 35,
      gender: "Male",
      password: "strongpass123",
      workType: "Electrician",
      city: "Jerusalem",
      street: "King George",
      houseNumber: 44,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("email", "worker1@example.com");

    const worker = await User.findOne({ email: "worker1@example.com" });
    expect(worker).not.toBeNull();
    expect(worker.isWorker).toBe(true);
    expect(worker.isAdmin).toBe(false);
    expect(worker.workType).toBe("Electrician");
    expect(worker.description).toBe("");
    expect(Array.isArray(worker.workerCalls)).toBe(true);
  });

  it("❌ should return 400 for missing parameters", async () => {
    const res = await request(app).post("/api/auth/signupwor").send({
      email: "missing@example.com",
      password: "abc123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing Parameters Please send all Parameters");
  });

  it("❌ should return 400 if email already exists", async () => {
    // Create a worker in advance
    await User.create({
      name: "Existing Worker",
      email: "already@worker.com",
      age: 40,
      gender: "Female",
      password: bcrypt.hashSync("existingpass", 8),
      workType: "Cleaner",
      city: "Tel Aviv",
      street: "Allenby",
      houseNumber: 5,
      isWorker: true,
      isAdmin: false,
      description: "",
    });

    const res = await request(app).post("/api/auth/signupwor").send({
      name: "New Worker",
      email: "already@worker.com",
      age: 30,
      gender: "Female",
      password: "newpass123",
      workType: "Plumber",
      city: "Haifa",
      street: "Beach Road",
      houseNumber: 9,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("this email is already exists");
  });
});
