cd /var/minds/sockets

echo "Starting sockets…"

npm install && npm install -g ts-node typescript nodemon

tsc

node /var/minds/sockets/build/index.js \
    --PORT $PORT \
    --REDIS-HOST $REDIS_HOST \
    --REDIS-PORT $REDIS_PORT \
    --JWT-SECRET $JWT_SECRET \
    --CASSANDRA-SERVERS $CASSANDRA_SERVERS \
--CASSANDRA-KEYSPACE $CASSANDRA_KEYSPACE