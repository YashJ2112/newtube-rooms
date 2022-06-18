import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoomUpdateSchema } from './room.model';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(
    @Body('name') roomName: string,
    @Body('joinLink') joinLink: string,
    @Body('capacity') roomCapacity?: number,
  ) {
    const generatedId = await this.roomsService.createRoom(
      roomName,
      joinLink,
      roomCapacity,
    );
    return { id: generatedId };
    console.log('Room created');
  }

  @Get()
  async getAllRooms() {
    const rooms = await this.roomsService.getRooms();
    return rooms;
  }

  @Get(':id')
  getRoom(@Param('id') roomId: string) {
    return this.roomsService.getSingleRoom(roomId);
  }

  @Patch(':id')
  async updateRoom(
    @Param('id') roomId: string,
    @Body() roomData: RoomUpdateSchema,
  ) {
    await this.roomsService.updateRoom(roomId, roomData);
    return 'Success';
  }

  @Delete(':id')
  async deleteRoom(@Param('id') roomId: string) {
    await this.roomsService.deleteRoom(roomId);
    return 'Success';
  }
}
