FROM node:10.15-slim
ENV NODE_ENV=production APP=/app/ PORT=3000

RUN mkdir ${APP}
WORKDIR ${APP}

COPY package.json .
RUN npm install --no-audit

COPY . .

# Application port
EXPOSE ${PORT}

# Remote debugging port
EXPOSE 9229

CMD ["npm", "start"]
