FROM node:8-alpine

RUN apk add --no-cache git

COPY . .

#RUN npm install && npm install -g ts-node typescript nodemon

#RUN tsc

ENTRYPOINT node build/index.js \
    --PORT $PORT \
    --REDIS-HOST $REDIS_HOST \
    --REDIS-PORT $REDIS_PORT \
    --JWT-SECRET $JWT_SECRET \
    --CASSANDRA-SERVERS $CASSANDRA_SERVERS \
    --CASSANDRA-KEYSPACE $CASSANDRA_KEYSPACE
