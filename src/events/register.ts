import * as async from 'async';
import { Di } from '../core/di/di';
import { Helpers } from '../helpers';
import { Bootstrap } from '../bootstrap';

export class Register {

  private redis = Di.get('data/redis');

  constructor(private socket, private io){
    this.listen();
  }

  listen(){

    this.socket.on('register', (guid, access_token) => {

      if(!guid){
          console.log("[register][error]: guid not set (" + this.socket.id + ")");
          this.socket.emit('connect_error', 'Guid must be set..');
          return;
      }

      Helpers.getUserByAccessToken(access_token)
        .then((user_guid) => {
          if(user_guid != guid){
            return;
          }

          Bootstrap.register(this.socket, user_guid);
        });

    });
  }

}
