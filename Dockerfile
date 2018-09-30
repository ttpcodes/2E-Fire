FROM node:8.12-alpine as build

RUN apk add --no-cache git
RUN git clone https://gitlab.com/ttpcodes/2e-fire.git /srv
WORKDIR /srv

RUN yarn
RUN yarn run build

FROM node:8.12-alpine
WORKDIR /srv
COPY --from=build /srv/dist ./dist
COPY --from=build /srv/views ./views
COPY --from=build /srv/package.json .
COPY --from=build /srv/yarn.lock .

RUN yarn install --production=true

CMD ["yarn", "run", "start"]
