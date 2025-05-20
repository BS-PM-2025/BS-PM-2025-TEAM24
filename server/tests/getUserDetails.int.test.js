jest.setTimeout(20000);
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: getUserDetails", () => {
  let mongoServer;
  let token;
  let user;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    user = new User({
      name: "Detail User",
      age: 40,
      gender: "Male",
      email: "detail@test.com",
      password: "123456",
      city: "Netanya",
      street: "Kikar Haatzmaut",
      houseNumber: 3,
      workType: "Electrician",
    });

    await user.save();
    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("✅ should return user details for valid ID", async () => {
    const res = await request(app)
      .get(`/api/users/${user._id}`) // ✅ FIXED path
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", user.email);
    expect(res.body).toHaveProperty("city", user.city);
  });

  it("❌ should return 500 for invalid user ID format", async () => {
    const res = await request(app)
      .get("/api/users/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Error getting user ");
  });

  it("❌ should return 400 if user is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong user id please enter correct id");
  });
});
