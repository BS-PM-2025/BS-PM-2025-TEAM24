

const { authController } = require("../controllers/authController"); // adjust path as needed

/**
 * Helper → Express-like `res` object with chainable status() and json().
 */
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

/**
 * Helper → fake Fetch Response whose json() resolves to the supplied payload.
 */
const fakeFetchResponse = (payload) => ({
  ok: true,
  json: async () => payload,
});

beforeEach(() => {
  jest.clearAllMocks();
  // Replace the *global* fetch with a fresh mock for every test
  global.fetch = jest.fn();
});

describe("getLocationDetails", () => {
  it("returns formatted location details for valid coordinates", async () => {
    const req = { body: { lat: 32.0853, lng: 34.7818 } };

    const fakeData = {
      address: {
        city: "Tel Aviv",
        country: "Israel",
        road: "Rothschild",
        house_number: "12",
      },
    };

    // Two successful reverse-geocode calls (HE + EN)
    global.fetch.mockResolvedValue(fakeFetchResponse(fakeData));

    const res = buildRes();
    await authController.getLocationDetails(req, res);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("lat=32.0853")
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      city: "Tel Aviv, Israel | Tel Aviv, Israel",
      street: "Rothschild",
      houseNumber: "12",
    });
  });

  it("returns 400 when coordinates are missing", async () => {
    const req = { body: {} }; // no lat/lng
    const res = buildRes();

    await authController.getLocationDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing coordinates" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns 500 when an unexpected error occurs", async () => {
    const req = { body: { lat: 32, lng: 35 } };

    global.fetch.mockRejectedValue(new Error("network error"));

    const res = buildRes();
    await authController.getLocationDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Failed to get location details" })
    );
  });
});
