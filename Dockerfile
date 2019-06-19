FROM node:10.15-slim as build-step
ENV APP=/app/ PORT=3000
# ENV NODE_ENV=production

RUN mkdir ${APP}
WORKDIR ${APP}

COPY package*.json ./
RUN npm install


COPY . ./

RUN npm run build

FROM node:10.15-slim

COPY server/ ./

RUN npm install

COPY --from=build-step app/build /build

EXPOSE $PORT

CMD ["node","index.js"]
