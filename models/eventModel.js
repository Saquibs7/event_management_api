import pool from '../db';

export default {
  async create(event) {
    const { title, event_time, location, capacity } = event;
    const res = await pool.query(
      `INSERT INTO events (title,event_time,location,capacity)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [title, event_time, location, capacity]
    );
    return res.rows[0];
  },

  async findById(id) {
    const event = await pool.query(`SELECT * FROM events WHERE id=$1`, [id]);
    return event.rows[0];
  },

  async findWithRegistrations(id) {
    const event = await this.findById(id);
    const regs = await pool.query(
      `SELECT u.id, u.name, u.email
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = $1`,
      [id]
    );
    event.registrations = regs.rows;
    return event;
  },

  async listUpcoming() {
    const now = new Date().toISOString();
    const res = await pool.query(
      `SELECT * FROM events
       WHERE event_time > $1
       ORDER BY event_time ASC, location ASC`,
      [now]
    );
    return res.rows;
  },

};
