jest.setTimeout(20000);

// ✅ Set SECRET to match what your app uses
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");
const Events = require("../models/events");

describe("Integration Test: addEvent", () => {
  let mongoServer;
  let token;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const testUser = new User({
      name: "Test User",
      age: 28,
      gender: "Male",
      email: "test@example.com",
      password: "12345678",
      city: "Jerusalem",
      street: "Ben Yehuda",
      houseNumber: 15,
      workType: "Electrician",
    });

    await testUser.save();
    userId = testUser._id;

    token = jwt.sign({ id: userId }, process.env.SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // ✅ TEST 1: Valid event creation
  it("✅ should create a new event with valid data", async () => {
    const res = await request(app)
      .post("/api/events/addEvent") // ✅ correct path
      .set("Authorization", `Bearer ${token}`)
      .send({
        callType: "Plumbing",
        city: "Jerusalem",
        street: "Ben Yehuda",
        houseNumber: 12,
        description: "Leaking faucet",
        status: "Open",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Event created successfully");
    expect(res.body.event).toHaveProperty("city", "Jerusalem");
  });

  // ✅ TEST 2: Missing fields
  it("❌ should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/events/addEvent")
      .set("Authorization", `Bearer ${token}`)
      .send({
        callType: "Electric",
        city: "Haifa",
        street: "Hertzel",
        // Missing: description, status
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing required fields");
  });

  // ✅ TEST 3: Invalid user token
  it("❌ should return 403 if user is not found", async () => {
    const fakeToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .post("/api/events/addEvent")
      .set("Authorization", `Bearer ${fakeToken}`)
      .send({
        callType: "Repair",
        city: "Eilat",
        street: "Ocean",
        houseNumber: 5,
        description: "Broken AC",
        status: "Open",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Unauthorized");
  });
});
