FROM node:10.15.3-alpine

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./
RUN npm install
RUN npm install -g sequelize-cli
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

USER node

ARG PORT=3003
ENV PORT ${PORT}
EXPOSE ${PORT} 9229 9230
CMD [ "node", "index" ]
