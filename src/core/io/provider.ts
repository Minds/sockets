/**
 * Sockets provider
 */

import { Di } from '../di/di';
import { IO } from './io';

export const IO_PROVIDER : Function = function(){
  Di.bind('io', () => {
    return new IO();
  }, { factory: true });
}
