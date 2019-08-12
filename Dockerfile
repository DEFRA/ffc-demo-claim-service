FROM node:10.15.3-alpine

RUN npm install -g sequelize-cli

USER node
WORKDIR /home/node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

ARG PORT=3003
ENV PORT ${PORT}
EXPOSE ${PORT} 9229 9230
CMD [ "node", "index" ]
