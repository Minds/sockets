/**
 * IO Socket Server
 */

import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

import { Di } from '../di/di';
import * as config from '../../../config';
import { Helpers } from '../../helpers';
import { Online } from '../../online';

import { Bootstrap } from '../../bootstrap';

export class IO {

  app = express();
  server = this.app.listen(config.PORT);
  io = socketio.listen(this.server, { pingTimeout: 30000 });

  public constructor(){
    this.app.get('/', function (req, res){
      res.sendStatus(200);
    });

    this.io.use((socket, next) => {

      if(!socket.request.headers.cookie){
        //console.log('no cookies found');
        return next();
      }

      let c : any = cookie.parse(socket.request.headers.cookie);
      let token = c['socket_jwt'] || c['socket_jwt_multi'];
      if(!token){
        //console.log('no jwt cookie found');
        return next(); //no token sent, could be a mobile user
      }

      //check if the provided token is valid
      jwt.verify(token, config.JWT_SECRET, (err, decoded) => {

        if(err){
          console.log('[jwt]: token not found');
          return next(); //token not found, could be a mobile user though
        }

        //check if the guid matches the sessionId
        let guid = decoded.guid;
        let sessionId = decoded.sessionId;

        Helpers.getSession(sessionId)
          .then((base64 : string) => {
            let session;
            try {
              session = atob(base64);
            } catch (err) {
              session = base64; //incase its not
            }
            
            if(session.indexOf(guid) > -1){
              
              Bootstrap.register(socket, guid);
              console.log(`[jwt]: ${guid} just joined`);

              next();
            } else {
                //session not found for user
                console.log('[jwt]: session not found for ' + guid + ' ' + sessionId);
              return next();
            }
          })
          .catch(() => {
            console.log('[jwt]: no session found');
            next();
          });

      });

    });
  }

}
