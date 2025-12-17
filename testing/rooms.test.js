const app = require("../app");
const request = require("supertest");

describe("Rooms API", () => {
  test("Create room successfully", async () => {
    const res = await request(app).post("/rooms").send({
      room_number: "312",
      category: "testing",
      price: 1000,
      beds: 1,
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

  test("Fail when the beds is negative", async () => {
    const res = await request(app).post("/rooms").send({
      room_number: "305",
      category: "Double",
      price: 200,
      beds: -2,
    });
    expect(res.statusCode).toBe(400);
  });

  test("Fail when the beds value is a string", async () => {
    const res = await request(app).post("/rooms").send({
      room_number: "305",
      category: "Double",
      price: 200,
      beds: "two",
    });
    expect(res.statusCode).toBe(400);
  });

  test("Fail when the price value is a string", async () => {
    const res = await request(app).post("/rooms").send({
      room_number: "305",
      category: "Double",
      price: "two hundred",
      beds: 2,
    });
    expect(res.statusCode).toBe(400);
  });

  test("Delete a room", async () => {
    const res = await request(app).delete("/rooms/24");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Room deleted successfully");
  });
});
