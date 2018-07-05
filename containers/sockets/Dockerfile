FROM node:9-alpine

RUN apk update && apk add --no-cache git

COPY containers/sockets/start.sh start.sh
ENTRYPOINT [ "sh", "./start.sh" ]