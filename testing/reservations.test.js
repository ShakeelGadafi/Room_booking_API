const app = require("../app")
const request = require("supertest");

describe('Reservation API',(res,req)=>{

    test('Get all the reservation details', async()=>{
        const res = await request(app).get("/reservations");
        expect(res.statusCode).toBe(200);
    })

    test('Create reservation successfully', async () => {
    const res = await request(app).post('/reservations').send({
      room_id: 1,
      guest_name: 'Test1',
      check_in: '2025-12-10',
      check_out: '2025-12-12'
    });
    expect(res.statusCode).toBe(201);

  });

  test('Reject overlapping reservation', async () => {
    await request(app).post('/reservations').send({
      room_id: 1,
      user_name: 'Test2',
      date_start: '2025-12-11',
      date_end: '2025-12-13'
    });


});
});