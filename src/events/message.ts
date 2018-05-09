import * as async from 'async';
import { Di } from '../core/di/di';
import { Helpers } from '../helpers';
import * as config from '../../config';
//let twilio = require('twilio')(config.TWILIO.ID, config.TWILIO.SECRET);


export class SendMessage {

  private redis = Di.get('data/redis');
  private cassandra = Di.get('data/cassandra');

  constructor(private socket, private io){
    this.listen();
  }

  listen(){

    this.socket.on('sendMessage', (guid : string | number, message : Array<any>) => {

      //get our async details
      async.parallel([
        (cb) => Helpers.getGuidFromSocket(this.socket).then(from => cb(null, from)).catch(err => cb(err, null)),
        (cb) => Helpers.getSocketsFromGuid(guid).then(tos => cb(null, tos)).catch(err => cb(err, null))
      ], (err, res : Array<any>) => {
        this.send(res[0], res[1], message);
      });

    });

    /*this.socket.on('turnToken', (guid) => {
        twilio.tokens.create((err, response) => {
            if(err){
              //console.log(err);
            } else {
                this.socket.emit('turnToken', response);
                //console.log('sent a twillio token: ' + this.socket.id);
            }
        });
      });*/
  }

  send(from_guid : string | number, to_sockets : Array<string>, message : Array<any>){
    for(let to of to_sockets){
      this.io.to(to).emit('messageReceived', from_guid, message);
    }
  }

}
