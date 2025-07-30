// src/routes/userRoutes.js
const router = require('express').Router();
const ctrl = require('../controllers/userController');

router.post('/', ctrl.createUser);               // Create user
router.get('/:id', ctrl.getUser);                // Get user details
router.get('/:id/events', ctrl.getUserEvents);   // Get user's registered events

module.exports = router;
