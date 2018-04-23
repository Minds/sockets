import { Di } from './core/di/di';

//import * as debugModule from 'debug';
//let debug = debugModule('minds');

export class Helpers{

  static redis = Di.get('data/redis');
  static cassandra = Di.get('data/cassandra');

  /**
   * Returns the guid of a user from a socket
   */
  public static getGuidFromSocket(socket){
    let redis = Di.get('data/redis');
    return new Promise((resolve, reject) => {
      redis.client.get(`sockets:socket:${socket.id}`, (err, response) => {
        if(err){
          //console.log(`[redis][error]: ${err}`);
          reject(err);
          return false;
        }
        resolve(response);
      });

    });
  }

  /**
   * Set the guid for a socket
   */
  public static setGuidForSocket(socket, guid){
    console.log(`[redis][debug]: ${socket}:${guid}`);
    let redis = Di.get('data/redis');
    redis.client.set(`sockets:socket:${socket.id}`, guid);
  }

  /**
   * Return the socket ids for a user guid
   */
  public static getSocketsFromGuid(guid){
    let redis = Di.get('data/redis');
    return new Promise((resolve, reject) => {
      redis.client.lrange(`sockets:guid:${guid}`, 0, -1, (err, response) => {
        if(err){
          console.log(`[redis][error]: ${err}`);
          reject(err);
          return false;
        }
        resolve(response);
      });

    });
  }

  /**
   * Set the socket for a guid
   */
  public static setSocketForGuid(guid, socket){
    let redis = Di.get('data/redis');
    redis.client.rpush(`sockets:guid:${guid}`, socket.id);
  }

  /**
   * Returns a user object from an access token
   */
  public static getUserByAccessToken(token){
    let cassandra = Di.get('data/cassandra');
    //debug(`Looking up ${token}`);
    //console.log(`[oauth]: ${token}`);
    return new Promise((resolve, reject) => {

      cassandra.client.execute("SELECT * FROM entities WHERE \"KEY\"=?", [token], {prepare: true},
        (err, result) => {
          if(err){
            //console.log(`[oauth]${token} failed`);
            reject(err);
            return;
          }

          if(!result.rows || result.rows.length == 0){
            reject();
            return;
          }

          let user_guid;

          let data: any = (<any[]>result.rows).reduce((carry, row) => {
            carry[row.column1] = row.value;
            return carry;
          }, {});

          if (data.expires) {
            let expires = parseInt(data.expires, 10),
              now = Date.now() / 1000;

            if (expires <= now) {
              reject('Expired access token');
            }
          }

          user_guid = data.user_id;
          //debug(`Token ${token} resolved as ${user_guid}`);
          //console.log(`[oauth]${token} resolved  ${user_guid}`);
          resolve(user_guid);
        });

    });

  }

  /**
   * Return a session from a session token
   */
   public static getSession(id){
    let cassandra = Di.get('data/cassandra');
    return new Promise((resolve, reject) => {
      cassandra.client.execute(
        "SELECT * FROM session WHERE key=?", [id], {prepare: true},
        (err, result) => {
          if(err)
            return reject(true);
          for(var i=0; i < result.rows.length; i++){
            if(result.rows[i].column1 = 'data')
              return resolve(result.rows[i].value);
          }
          reject(true);
        });

    });
  }

  /**
   * Parses a room name
   */

  public static parseRoomName(roomName: string) {
    let data = {
      type: 'generic',
      guids: []
    };

    if (!roomName || roomName.indexOf(':') === -1) {
      return data;
    }

    let room = roomName.split(':'),
      type = room.splice(0, 1);

    data.type = type[0];
    data.guids = room;

    return data;
  }

}
