import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Module } from '@nestjs/common';
import { RoomSchema } from './room.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
