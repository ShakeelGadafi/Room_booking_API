const app = require("../app");
const request = require("supertest");

describe("Reservation API", () => {
  test("Get all the reservation details", async () => {
    const res = await request(app).get("/reservations");
    expect(res.statusCode).toBe(200);
  });

  test("Create reservation successfully", async () => {
    const res = await request(app).post("/reservations").send({
      room_id: 5,
      guest_name: "Test5",
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
    expect(res.statusCode).toBe(409);
  });

  test("List reservations by room", async () => {
    const res = await request(app).get("/reservations/room/1");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should fail if check-in >= check-out", async () => {
    const res = await request(app).post("/reservations").send({
      room_id: 1,
      guest_name: "Test Guest",
      check_in: "2025-12-25",
      check_out: "2025-12-23",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("check_out must be after check_in");
  });

  test("should return message if no reservations exist", async () => {
    const res = await request(app).get("/reservations/room/999");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("No reservations found for this room");
  });
  test("Update reservation details", async () => {
    const res = await request(app).put("/reservations/3").send({
      guest_name: "Updated Guest",
      check_in: "2026-2-21",
      check_out: "2026-2-30",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.reservation.guest_name).toBe("Updated Guest");
  });
  test("Delete a reservation", async () => {
    const res = await request(app).delete("/reservations/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reservation deleted successfully");
  });
});
