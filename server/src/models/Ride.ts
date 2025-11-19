import mongoose, { Document, Schema } from 'mongoose';

export interface IRide extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  distance: number; // in kilometers
  duration: number; // in minutes
  notes?: string;
  createdAt: Date;
}

const rideSchema = new Schema<IRide>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Ride date is required'],
    default: Date.now
  },
  distance: {
    type: Number,
    required: [true, 'Distance is required'],
    min: [0, 'Distance must be positive']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [0, 'Duration must be positive']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
rideSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IRide>('Ride', rideSchema);
