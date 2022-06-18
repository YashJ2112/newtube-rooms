import { ConfigModule } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { env } from 'process';
import * as supertest from 'supertest';
import { Room } from './room.model';
import { RoomsModule } from './rooms.module';

describe('RoomsController', () => {
  let app: NestExpressApplication;
  const roomToCreate = {
    name: 'Yoshi',
    joinLink: 'link',
  };
  const roomToUpdate = {
    name: 'Jhon',
    joinLink: 'newLink',
  };
  const apiClient = () => {
    return supertest(app.getHttpServer());
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(env.MONGO_URI_TESTS, {
          useNewUrlParser: true,
        }),
        RoomsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.listen(3005);
  });

  afterEach(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropCollection(
      'roomTest',
    );
    await app.close();
  });

  it('creates a room', async () => {
    await apiClient().post('/rooms').send(roomToCreate).expect(201);
    const rooms: Room[] = (await apiClient().get('/rooms')).body;
    expect(rooms[0].name).toBe('Yoshi');
    expect(rooms[0].joinLink).toBe('link');
    expect(rooms[0].capacity).toBe(3);
  });

  it('get all rooms', async () => {
    await apiClient().get('/rooms').expect(200);
  });

  it('get a room by id', async () => {
    const room = await apiClient()
      .post('/rooms')
      .send(roomToCreate)
      .then((response) => {
        return response.body;
      });
    const roomId = room.id;
    await apiClient()
      .get('/rooms/' + roomId)
      .expect(200);
    const createdRoom: Room = (await apiClient().get('/rooms/' + roomId)).body;
    expect(createdRoom.id).toBe(roomId);
    expect(createdRoom.name).toBe('Yoshi');
    expect(createdRoom.joinLink).toBe('link');
    expect(createdRoom.capacity).toBe(3);
  });

  it('update a room by id', async () => {
    const room = await apiClient()
      .post('/rooms')
      .send(roomToCreate)
      .then((response) => {
        return response.body;
      });
    const roomId = room.id;
    await apiClient()
      .patch('/rooms/' + roomId)
      .send(roomToUpdate)
      .expect(200)
      .then((response) => {
        return response.body;
      });
    const updatedRoom: Room = (await apiClient().get('/rooms/' + roomId)).body;
    expect(updatedRoom.id).toBe(roomId);
    expect(updatedRoom.name).toBe('Jhon');
    expect(updatedRoom.joinLink).toBe('newLink');
    expect(updatedRoom.capacity).toBe(3);
  });

  it('delete a room by id', async () => {
    const room = await apiClient()
      .post('/rooms')
      .send(roomToCreate)
      .then((response) => {
        return response.body;
      });
    const roomId = room.id;
    await apiClient()
      .delete('/rooms/' + roomId)
      .expect(200);
    await apiClient()
      .get('/rooms/' + roomId)
      .expect(404);
  });

  it('get a non-existent room by id', async () => {
    const roomId = 123;
    await apiClient()
      .get('/rooms/' + roomId)
      .expect(404);
    // expect(noexistRoom.id).toBe(null);
  });
});
