/**
 * Cassandra
 */

import * as _cassandra from 'cassandra-driver';

import * as config from '../../../config';

export class Cassandra {

  public client;

  constructor(){
    this.client = new _cassandra.Client({
      contactPoints: config.CASSANDRA.SERVERS,
      keyspace: config.CASSANDRA.KEYSPACE
    });
  }

}
