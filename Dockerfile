ARG PORT=3003
ARG PARENT_VERSION=1.0.0-node12.16.0
ARG REGISTRY=562955126301.dkr.ecr.eu-west-2.amazonaws.com

# Development
FROM ${REGISTRY}/ffc-node-development:${PARENT_VERSION} AS development
ARG PORT
ARG PARENT_VERSION
ARG REGISTRY
LABEL uk.gov.defra.ffc.parent-image=${REGISTRY}/ffc-node-development:${PARENT_VERSION}

ARG PORT_DEBUG=9229
ENV PORT ${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
CMD [ "npm", "run", "start:watch" ]

# Production
FROM ${REGISTRY}/ffc-node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
ARG REGISTRY
ARG PORT
LABEL uk.gov.defra.ffc.parent-image=${REGISTRY}/ffc-node:${PARENT_VERSION}

ENV PORT ${PORT}
EXPOSE ${PORT}

COPY --from=development /home/node/index.js /home/node/package*.json /home/node/.sequelizerc /home/node/
COPY --from=development /home/node/server  /home/node/server
RUN npm ci
CMD [ "node", "index" ]
