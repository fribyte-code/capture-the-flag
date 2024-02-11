# Dockerfile to be used locally to build docker image for ConnectFleet
# ---- Base Node ----
FROM node:lts-alpine AS build-stage

# Create app directory
WORKDIR /app

# ---- Dependencies ----
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# ----- Web Server ----
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist /app
RUN sha256sum /app/index.html | cut -d ' ' -f 1  > /app/index.html.sha256sum

EXPOSE 80

RUN apk add --no-cache jq

ARG APP_BUILD=next
ARG APP_BUILD_DATE=2023-02-28
ENV APP_BUILD=$APP_BUILD
ENV APP_BUILD_DATE=$APP_BUILD_DATE
ARG APP_VERSION=next

COPY docker-entrypoint.sh /
RUN ["chmod", "+x", "/docker-entrypoint.sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]