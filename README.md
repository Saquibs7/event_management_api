# Event Management API

## 🚀 Features

- Create events (capacity, future dates only)
- Register / cancel user registrations
- List upcoming events (sorted by date & location)
- View event stats (total, remaining, % used)

## 🛠️ Tech Stack

- Node.js + Express
- PostgreSQL + `pg`
- Joi for validation

## 🔧 Setup

1. Clone repo
2. `npm install`
3. Configure `.env`
4. Run migrations: `npx knex migrate:latest`
5. Start server: `npm run dev`

## 📚 API Endpoints

### Create Event
- **POST** `/api/events`
- Body: `{ title, event_time, location, capacity }`
- Success: `201 { eventId }`

### Get Event Details
- **GET** `/api/events/:id`
- Response: full event + registered users

### Register for Event
- **POST** `/api/events/register`
- Body: `{ userId, eventId }`
- Errors: 400 if full/past, 409 if duplicate

### Cancel Registration
- **POST** `/api/events/cancel`
- Body: `{ userId, eventId }`

### List Upcoming
- **GET** `/api/events`
- Sorted by date ↑ then location ↑

### Event Stats
- **GET** `/api/events/:id/stats`

## 🔗 Database Schema

... migrations SQL ...

## 👤 User API Endpoints

### 🔹 Create User

**POST** `/api/users`  
Create a new user in the system.

#### Request Body:
```json
{
  "name": "Saquib Hussain",
  "email": "saquib@example.com"
}
