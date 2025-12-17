const app = require("../app");
const request = require("supertest");

describe("Rooms API", () => {
  test("Create room successfully", async () => {
    const res = await request(app).post("/rooms").send({
      room_number: "307",
      category: "Double",
      price: 200,
      beds: 2,
    });
    expect(res.statusCode).toBe(201);
  });

  test("Get all rooms", async () => {
    const res = await request(app).get("/rooms");
    expect(res.statusCode).toBe(200);
  });

  test("Fail when the price is negative", async () => {
    const res = await request(app).post("/rooms").send({
      room_number: "305",
      category: "Double",   
      price: -200,
      beds: 2,
    });
    expect(res.statusCode).toBe(400);
  });

});

