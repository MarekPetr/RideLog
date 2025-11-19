import { Response } from 'express';
import Ride from '../models/Ride';
import { AuthRequest } from '../middleware/auth';

export const createRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date, distance, duration, notes } = req.body;
    const userId = req.userId;

    // Validation
    if (!date || !distance || !duration) {
      res.status(400).json({ message: 'Date, distance, and duration are required' });
      return;
    }

    if (distance <= 0 || duration <= 0) {
      res.status(400).json({ message: 'Distance and duration must be positive numbers' });
      return;
    }

    // Create ride
    const ride = await Ride.create({
      userId,
      date: new Date(date),
      distance,
      duration,
      notes
    });

    res.status(201).json({
      message: 'Ride logged successfully',
      ride
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ message: 'Server error while creating ride' });
  }
};

export const getRides = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    // Get all rides for the user, sorted by date (newest first)
    const rides = await Ride.find({ userId }).sort({ date: -1 });

    res.json({
      count: rides.length,
      rides
    });
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ message: 'Server error while fetching rides' });
  }
};

export const updateRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, distance, duration, notes } = req.body;
    const userId = req.userId;

    // Find ride and verify ownership
    const ride = await Ride.findOne({ _id: id, userId });
    if (!ride) {
      res.status(404).json({ message: 'Ride not found or you do not have permission to edit it' });
      return;
    }

    // Validation
    if (distance !== undefined && distance <= 0) {
      res.status(400).json({ message: 'Distance must be a positive number' });
      return;
    }
    if (duration !== undefined && duration <= 0) {
      res.status(400).json({ message: 'Duration must be a positive number' });
      return;
    }

    // Update fields
    if (date) ride.date = new Date(date);
    if (distance !== undefined) ride.distance = distance;
    if (duration !== undefined) ride.duration = duration;
    if (notes !== undefined) ride.notes = notes;

    await ride.save();

    res.json({
      message: 'Ride updated successfully',
      ride
    });
  } catch (error) {
    console.error('Update ride error:', error);
    res.status(500).json({ message: 'Server error while updating ride' });
  }
};

export const deleteRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find and delete ride, verifying ownership
    const ride = await Ride.findOneAndDelete({ _id: id, userId });
    if (!ride) {
      res.status(404).json({ message: 'Ride not found or you do not have permission to delete it' });
      return;
    }

    res.json({
      message: 'Ride deleted successfully',
      rideId: id
    });
  } catch (error) {
    console.error('Delete ride error:', error);
    res.status(500).json({ message: 'Server error while deleting ride' });
  }
};

export const getRideStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    // Get all rides for the user
    const rides = await Ride.find({ userId }).sort({ date: 1 });

    // Group rides by date and sum distances
    const dailyStats = rides.reduce((acc: { [key: string]: number }, ride) => {
      const dateKey = new Date(ride.date).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey] += ride.distance;
      return acc;
    }, {});

    // Convert to array format for charting
    const stats = Object.entries(dailyStats).map(([date, distance]) => ({
      date,
      distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
    }));

    // Calculate summary statistics
    const totalDistance = rides.reduce((sum, ride) => sum + ride.distance, 0);
    const totalDuration = rides.reduce((sum, ride) => sum + ride.duration, 0);
    const averageSpeed = totalDuration > 0 ? (totalDistance / (totalDuration / 60)) : 0;

    res.json({
      dailyStats: stats,
      summary: {
        totalRides: rides.length,
        totalDistance: Math.round(totalDistance * 100) / 100,
        totalDuration,
        averageSpeed: Math.round(averageSpeed * 100) / 100
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
};
