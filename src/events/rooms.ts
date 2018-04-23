import * as async from 'async';
import { Di } from '../core/di/di';
import { Helpers } from '../helpers';
import { Online } from '../online';

export class Rooms {

  private redis = Di.get('data/redis');
  private cassandra = Di.get('data/cassandra');

  constructor(private socket, private io){
    this.listen();

    this.socket.join(this.socket.id, () => {
      // Already joined socket ID room automatically, but still
      // fires callback when rooms engine is ready.
      this.socket.emit('rooms', this.getRooms());
    });
  }

  listen() {
    this.socket.on('join', (rooms: any) => {

      if (!rooms) {
        return;
      }

      if (typeof rooms === 'string') {
        rooms = [ rooms ];
      }

      if (!rooms.length) {
        return;
      }

      Helpers.getGuidFromSocket(this.socket)
        .then((guid) => {

          rooms.forEach((room) => {
            //console.log(`[room]: join '${room}'`);

            if (!this.allowed(guid, room)) {
              this.socket.emit('joinError', room, 'NOT_ALLOWED');
              return;
            }

            try {
              this.socket.join(room, (e) => {
                if (!e) {
                  this.socket.emit('joined', room, this.getRooms());
                } else {
                  this.socket.emit('joinError', room, e);
                }
              });
            } catch(e) {
              this.socket.emit('joinError', room, e);
            }
          });
        })
        .catch(e => {
          rooms.forEach((room) => {
            this.socket.emit('joinError', room, e);
          });
        });
    });

    this.socket.on('leave', (rooms: any) => {
      if (!rooms) {
        return;
      }

      if (typeof rooms === 'string') {
        rooms = [ rooms ];
      }

      if (!rooms.length) {
        return;
      }

      rooms.forEach((room) => {
        //console.log(`[room]: leave '${room}'`);

        try {
          this.socket.leave(room, (e) => {
            if (!e) {
              this.socket.emit('left', room, this.getRooms());
            } else {
              this.socket.emit('leaveError', room, e);
            }
          });
        } catch(e) {
          this.socket.emit('leaveError', room, e);
        }
      });
    });
  }

  getRooms() {
    let rooms = Object.keys(this.socket.rooms),
      ownRoomIndex = rooms.indexOf(this.socket.id);

    if (ownRoomIndex > -1) {
      rooms.splice(ownRoomIndex, 1);
    }

    return rooms;
  }

  allowed(guid, roomName) {
    let room = Helpers.parseRoomName(roomName),
      allowed = true;

    switch (room.type) {
      case 'live':
        allowed = room.guids.indexOf(guid) === 0;
        break;
      case 'conversation':
        allowed = room.guids.indexOf(guid) > -1;
        break;
    }

    return allowed;
  }
}
