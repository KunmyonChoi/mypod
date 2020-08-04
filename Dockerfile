# Alpine base node image for production
FROM node:14-alpine3.12

LABEL authors="Kunmyon Choi" desc="My Sample nodejs app"

# node process doesn't get kill signal, so we use tini init to prevent zombies.
RUN apk add --no-cache tini

WORKDIR /usr/src/app

# Also copy package-lock.json to prevent conflict
COPY package*.json ./

# Run process with non-root user
USER node

# Use npm ci to install production dependency fast
RUN npm ci --only=production

# Only copy compiled bundle for production
COPY --chown=node:node dist ./dist

EXPOSE 8080

# CMD will run command using tini init
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/bundle.js"]