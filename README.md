Minds Sockets
=============

Sockets server for Minds.

### Documentation
Documentation for Minds can be found at [minds.org/docs](https://www.minds.org/docs)

### Building

```
# install dependencies
npm install -g ts-node typescript
npm install

# build from typescript to js
tsc

# build the docker container
docker build -t minds/sockets -f containers/sockets/Dockerfile .

# run the container
docker run -t minds/sockets \
    -e CASSANDRA_KEYSPACE='minds' \
    -e CASSANDRA_SERVERS='10.0.8.13' \
    -e JWT_SECRET='keepsave-and-match-settings.php' \
    -e PORT=3030 \
    -e REDIS_HOST='redis-host' \
    -e REDIS_PORT='6379
```

## License
[AGPLv3](https://www.minds.org/docs/license.html). Please see the license file of each repository.

___Copyright Minds 2018___