/**
 * Redis
 */

import * as _redis from 'redis';

import * as config from '../../../config';

export class Redis {

  public client;

  constructor(){
    this.client = _redis.createClient(config.REDIS.PORT, config.REDIS.HOST);
  }

}
