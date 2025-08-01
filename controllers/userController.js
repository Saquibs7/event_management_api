import { AppError } from '../utils/error';
import userModel from '../models/userModel';

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new AppError('Name and email are required', 422);
    }

    const user = await userModel.create(name, email);
    res.status(201).json({ userId: user.id });
  } catch (err) {
    if (err.code === '23505') {
      return next(new AppError('Email already exists', 409));
    }
    next(err);
  }
};

// Get user detail
exports.getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Get events where user is registered
exports.getUserEvents = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);

    const events = await userModel.getRegisteredEvents(req.params.id);
    res.json(events);
  } catch (err) {
    next(err);
  }
};
