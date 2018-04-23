
import { Di } from './core/di/di';

export class Online{

  static redis = Di.get('data/redis');
  static cassandra = Di.get('data/cassandra');

  static clear(){
    Di.get('data/redis').client.del("online");
  }

  static push(guid){
    Di.get('data/redis').client.sadd("online", guid);
  }

  static pop(guid){
    Di.get('data/redis').client.srem("online", guid, -1);
  }

}
