import express from 'express';
import { createRide, getRides, getRideStats, updateRide, deleteRide } from '../controllers/rideController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All ride routes require authentication
router.use(authenticateToken);

router.post('/', createRide);
router.get('/', getRides);
router.get('/stats', getRideStats);
router.put('/:id', updateRide);
router.delete('/:id', deleteRide);

export default router;
