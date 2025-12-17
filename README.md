# Room Booking API

A RESTful API for managing room bookings and reservations, built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher recommended)
- PostgreSQL

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShakeelGadafi/Room_booking_API.git
   cd Room_booking_API
   ```

2. Install dependencies:
   ```bash
   npm install
   npm i pg express dotenv nodemon
   ```

## Configuration

1. Create a `.env` file in the root directory.
2. Add the following environment variables with your PostgreSQL database credentials:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   ```

   *Note: Ensure the database specified in `DB_NAME` exists.*

## Database Setup

You need to create the necessary tables in your PostgreSQL database. Run the following SQL queries:

```sql
-- Create rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    beds INTEGER NOT NULL
);

-- Create reservations table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    guest_name VARCHAR(100) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL
);
```

## Running the Application

To start the server in development mode (using nodemon):

```bash
npm start
```

The server will start on `http://localhost:3000`.

## Running Tests

To run the test suite (using Jest):

```bash
npm test
```

## API Endpoints

### Rooms
- **List Rooms**: `GET /rooms`
- **Create Room**: `POST /rooms`
- **Update Room**: `PUT /rooms/:id`
- **Delete Room**: `DELETE /rooms/:id`

### Reservations
- **List Reservations**: `GET /reservations`
- **List Reservations by Room**: `GET /reservations/room/:roomId`
- **Create Reservation**: `POST /reservations`
- **Update Reservation**: `PUT /reservations/:id`
- **Delete Reservation**: `DELETE /reservations/:id`

## Project Structure

- `app.js`: Express application setup.
- `server.js`: Server entry point.
- `configure/db.js`: Database connection configuration.
- `controllers/`: Request handlers.
- `routes/`: API route definitions.
- `testing/`: Unit and integration tests.