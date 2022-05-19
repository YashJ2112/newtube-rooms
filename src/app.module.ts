import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGO_URI, {
      useNewUrlParser: true,
    }),
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
