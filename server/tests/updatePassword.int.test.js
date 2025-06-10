jest.setTimeout(60000); // في بداية كل ملف test أو في jest.setup.js إذا عندك
process.env.SECRET = "testsecret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const User = require("../models/users");

describe("Integration Test: updatePassword", () => {
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

    const hashedPassword = bcrypt.hashSync("oldpass123", 8);

    user = new User({
      name: "Password Tester",
      age: 28,
      gender: "Female",
      email: "password@test.com",
      password: hashedPassword,
      city: "Akko",
      street: "Old City",
      houseNumber: 4,
      workType: "Cook",
    });

    await user.save();

    token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("✅ should update password when current password is valid", async () => {
    const res = await request(app)
      .put(`/api/users/${user._id}/updatePassword`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "oldpass123",
        newPassword: "newpass456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password updated successfully");

    const updatedUser = await User.findById(user._id);
    const isValid = bcrypt.compareSync("newpass456", updatedUser.password);
    expect(isValid).toBe(true);
  });

  it("❌ should fail with 400 if current password is incorrect", async () => {
    const res = await request(app)
      .put(`/api/users/${user._id}/updatePassword`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "wrongpass",
        newPassword: "anotherpass123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Current password is incorrect");
  });

  it("❌ should return 404 if user not found", async () => {
    const fakeToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .put(`/api/users/${user._id}/updatePassword`)
      .set("Authorization", `Bearer ${fakeToken}`)
      .send({
        currentPassword: "oldpass123",
        newPassword: "irrelevant123",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});
