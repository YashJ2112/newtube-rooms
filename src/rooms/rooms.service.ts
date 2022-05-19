import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomUpdateSchema } from './room.model';
import { Model } from 'mongoose';

@Injectable()
export class RoomsService {
  // private rooms: Room[] = [];

  constructor(@InjectModel('Room') private readonly roomModel: Model<Room>) {}

  async createRoom(name: string, joinLink: string, capacity: number = 3) {
    const newRoom = new this.roomModel({
      name,
      joinLink: joinLink,
      capacity,
    });
    const result = await newRoom.save();
    // console.log(result);
    return result.id;
  }

  async getRooms() {
    const rooms = await this.roomModel.find().exec();
    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      joinLink: room.joinLink,
      capacity: room.capacity,
    }));
  }

  async getSingleRoom(roomId: string) {
    const room = await this.findRoom(roomId);
    return {
      id: room.id,
      name: room.name,
      joinLink: room.joinLink,
      capacity: room.capacity,
    };
  }

  async updateRoom(roomId: string, roomData: RoomUpdateSchema) {
    const updatedRoom = await this.findRoom(roomId);
    for (const key in roomData) {
      updatedRoom[key] = roomData[key];
    }
    updatedRoom.save();
  }

  async deleteRoom(roomId: string) {
    const result = await this.roomModel.deleteOne({ _id: roomId }).exec();
    // console.log(result);
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find room');
    }
  }

  private async findRoom(id: string): Promise<Room> {
    let room;
    try {
      room = await this.roomModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find room!!');
    }
    return room;
  }
}
