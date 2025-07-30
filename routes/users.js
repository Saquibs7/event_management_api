import ctrl from '../controllers/userController.js';
import express from 'express';
const router = express.Router();

router.post('/', ctrl.createUser);            
router.get('/:id', ctrl.getUser);                
router.get('/:id/events', ctrl.getUserEvents);   

export default router;
