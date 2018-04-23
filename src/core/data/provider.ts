/**
 * Data provider
 */

import { Di } from '../di/di';
import { Redis } from './redis';
import { Cassandra } from './cassandra';

export const DATA_PROVIDER : Function = function(){

  Di.bind('data/redis', () => {
    return new Redis();
  }, { factory: true });

  Di.bind('data/cassandra', () => {
    return new Cassandra();
  }, { factory: true });
}
