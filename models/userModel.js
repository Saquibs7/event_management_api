import { Pool } from '../db/index.js';
export default {
  async create(name, email) {
    const res = await pool.query(
      `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
      [name, email]
    );
    return res.rows[0];
  },

  async findById(id) {
    const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return res.rows[0];
  },

  async getRegisteredEvents(userId) {
    const res = await pool.query(
      `SELECT e.id, e.title, e.event_time, e.location
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = $1`,
      [userId]
    );
    return res.rows;
  }
};
