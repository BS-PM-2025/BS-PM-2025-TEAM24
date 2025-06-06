jest.setTimeout(20000);
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");
const Events = require("../models/events");

describe("Integration Test: updateEvent", () => {
  let mongoServer;
  let token;
  let user;
  let event;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    user = new User({
      name: "Update Tester",
      age: 35,
      gender: "Male",
      email: "update@test.com",
      password: "123456",
      city: "Ramla",
      street: "Central",
      houseNumber: 21,
      workType: "Repairman",
    });

    await user.save();
    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });

    event = new Events({
      callType: "Electric",
      city: "Ramla",
      street: "Old Street",
      houseNumber: 12,
      description: "Old issue",
      costumerdetails: [`Name: ${user.name}`, `Age: ${user.age}`, `Gender: ${user.gender}`],
      status: "Open",
    });

    await event.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("✅ should update the event successfully", async () => {
    const res = await request(app)
      .put(`/api/events/updateEvent/${event.callID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        callType: "Plumbing",
        city: "Ramla",
        street: "New Street",
        houseNumber: 99,
        description: "Updated issue",
        status: "In Progress",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Call updated successfully");
    expect(res.body.event).toHaveProperty("callType", "Plumbing");
    expect(res.body.event).toHaveProperty("street", "New Street");
    expect(res.body.event).toHaveProperty("status", "In Progress");
  });

  it("❌ should return 404 if event not found", async () => {
    const res = await request(app)
      .put("/api/events/updateEvent/fake-id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        callType: "Repair",
        city: "Haifa",
        street: "Imaginary",
        houseNumber: 123,
        description: "Doesn't exist",
        status: "Closed",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Call not found");
  });
});
