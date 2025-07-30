import { AppError } from '../utils/error';
import eventModel from '../models/eventModel';
import pool from '../db';

exports.createEvent = async (req, res, next) => {
  try {
    const { error, value } = require('../utils/validators').eventSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const event = await eventModel.create(value);
    res.status(201).json({ eventId: event.id });
  } catch (err) {
    next(err);
  }
};

// Get Event Details
exports.getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventModel.findWithRegistrations(id);
    if (!event) throw new AppError('Event not found', 404);
    res.json(event);
  } catch (err) {
    next(err);
  }
};

// Register anEvent
exports.register = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { userId, eventId } = req.body;
    await client.query('BEGIN');

    // 1) Check event exists and is not in the past
    const eventRes = await client.query(`SELECT capacity, event_time FROM events WHERE id=$1 FOR UPDATE`, [eventId]);
    if (!eventRes.rowCount) throw new AppError('Event not found', 404);
    const { capacity, event_time } = eventRes.rows[0];
    if (new Date(event_time) <= new Date()) throw new AppError('Cannot register for past events', 400);

    // 2) Check if full
    const regCount = await client.query(`SELECT COUNT(*) FROM registrations WHERE event_id=$1`, [eventId]);
    if (parseInt(regCount.rows[0].count) >= capacity) throw new AppError('Event is full', 400);

    // 3) Prevent duplicates
    const dup = await client.query(
      `SELECT 1 FROM registrations WHERE user_id=$1 AND event_id=$2`,
      [userId, eventId]
    );
    if (dup.rowCount) throw new AppError('Already registered', 409);

    // 4) Insert
    await client.query(
      `INSERT INTO registrations (user_id, event_id) VALUES ($1,$2)`,
      [userId, eventId]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// Cancel Registration
exports.cancel = async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;
    const del = await pool.query(
      `DELETE FROM registrations WHERE user_id=$1 AND event_id=$2`,
      [userId, eventId]
    );
    if (!del.rowCount) throw new AppError('Not registered', 404);
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    next(err);
  }
};

// List Upcoming Events
exports.listUpcoming = async (req, res, next) => {
  try {
    const events = await eventModel.listUpcoming();
    res.json(events);
  } catch (err) {
    next(err);
  }
};

// Event Stats
exports.stats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ev = await eventModel.findById(id);
    if (!ev) throw new AppError('Event not found', 404);

    const { capacity } = ev;
    const regCount = await pool.query(
      `SELECT COUNT(*) FROM registrations WHERE event_id=$1`,
      [id]
    );
    const total = parseInt(regCount.rows[0].count);
    res.json({
      totalRegistrations: total,
      remainingCapacity: capacity - total,
      percentUsed: ((total / capacity) * 100).toFixed(2) + '%'
    });
  } catch (err) {
    next(err);
  }
};
