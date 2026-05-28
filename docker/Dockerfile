FROM node:26-alpine3.22 AS build

RUN npm install -g pnpm@11
RUN echo "pnpm version: $(pnpm --version)"

WORKDIR /app
COPY ../ ./
RUN rm .env
RUN mv .env.production .env
RUN pnpm i --frozen-lockfile
RUN pnpm run build:local

FROM node:26-alpine3.22

WORKDIR /opt/web-rating
COPY --from=build /app/.env ./
COPY --from=build /app/dist/web-rating ./

CMD ["node", "server/server.mjs"]


EXPOSE 4000
