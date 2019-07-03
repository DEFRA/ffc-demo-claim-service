FROM node:10.15.3-alpine

# Create app directory
WORKDIR /mine-support-claim-service

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g sequelize-cli
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3003
CMD [ "node", "index" ]
