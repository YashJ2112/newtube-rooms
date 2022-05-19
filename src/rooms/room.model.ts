import mongoose from 'mongoose';

export const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  joinLink: { type: String, required: true },
  capacity: { type: Number, required: true },
});

export interface RoomUpdateSchema {
  name?: string;
  joinLink?: string;
  capacity?: number;
}

export interface Room extends mongoose.Document {
  id: string;
  name: string;
  joinLink: string;
  capacity: number;
}
