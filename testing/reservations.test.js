const app = require("../app");
const request = require("supertest");

describe("Reservation API", () => {
  test("Get all the reservation details", async () => {
    const res = await request(app).get("/reservations");
    expect(res.statusCode).toBe(200);
  });

  test("Create reservation successfully", async () => {
    const res = await request(app).post("/reservations").send({
      room_id: 1,
      guest_name: "Test3",
      check_in: "2026-01-10",
      check_out: "2026-01-12",
    });
    expect(res.statusCode).toBe(201);
  });

  test("Reject overlapping reservation", async () => {
    const res = await request(app).post("/reservations").send({
      room_id: 1,
      guest_name: "Test2",
      check_in: "2025-12-11",
      check_out: "2025-12-13",
    });
    expect(res.statusCode).toBe(400);
  });

  test("List reservations by room", async () => {
    const res = await request(app).get("/reservations/room/1");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
