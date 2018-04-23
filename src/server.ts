import * as _redis  from 'redis';
import * as _ioRedis from 'socket.io-redis';

import * as config from '../config';
import { Register } from './events/register';
import { SendMessage } from './events/message';
import { Rooms } from './events/rooms';
import { Helpers } from './helpers';
import { Online } from './online';

import { Di } from './core/di/di';
import { IO_PROVIDER } from './core/io/provider';
import { DATA_PROVIDER } from './core/data/provider';

export class MindsSocketServer {

  private io;

  public redis;
  public cassandra;

  constructor(){
  }

  init(){
    this.initBindings();
    this.initIOAdapter();
    //now run socket server
    this.listen();
  }

  initIOAdapter(){
    console.log('[init]: connecting to redis adapter');
    this.io.adapter(_ioRedis({
      pubClient: _redis.createClient(config.REDIS.PORT, config.REDIS.HOST),
      subClient: _redis.createClient(config.REDIS.PORT, config.REDIS.HOST, { detect_buffers: true })
    }));
  }

  initBindings(){
    IO_PROVIDER();
    DATA_PROVIDER();
    this.io = Di.get('io').io;
  }

  listen(){
    console.log('[listen]: Started listening on port %s', config.PORT);
    Online.clear();
    this.io.on('connection', (socket) => {
      console.log('[connection]: received');

      let register = new Register(socket, this.io);
      let message = new SendMessage(socket, this.io);
      let rooms = new Rooms(socket, this.io);

      //on disconnect remove from the online list
      socket.on('disconnect', () => {
        Helpers.getGuidFromSocket(socket)
          .then((guid) => Online.pop(guid));
      });
    });
  }

}

new MindsSocketServer();
