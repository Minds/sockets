import { Helpers } from './helpers';
import { Online } from './online';

export class Bootstrap {
  static register(socket, guid) {
    Helpers.setGuidForSocket(socket, guid);
    Helpers.setSocketForGuid(guid, socket);

    socket.emit('registered', guid);
    Online.push(guid);
  }
}
