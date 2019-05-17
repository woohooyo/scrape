FROM node:10.13.0-slim

ENV ROOT_APP_DIR=/webapp/current

WORKDIR $ROOT_APP_DIR

COPY ./package*.json ./.env ./pm2.json $ROOT_APP_DIR/

RUN npm install -g pm2

RUN npm install

COPY ./output $ROOT_APP_DIR/

EXPOSE 8080

CMD ["pm2-runtime", "pm2.json"]
