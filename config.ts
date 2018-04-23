import {argv} from 'yargs';

export const PORT = argv['PORT'] || 8010;

export const MULTI = argv['MULTI'] || false;

export const TWILIO = {
  ID: '',
  SECRET: ''
};

export const REDIS = {
  HOST: argv['REDIS-HOST'] || '127.0.0.1',
  PORT: argv['REDIS-PORT'] || 6379
};

export const CASSANDRA = {
  SERVERS: argv['CASSANDRA-SERVERS'] ? [ argv['CASSANDRA-SERVERS'] ] : [ '127.0.0.1' ],
  KEYSPACE: argv['CASSANDRA-KEYSPACE'] || 'minds'
};

export const JWT_SECRET = argv['JWT-SECRET'];
