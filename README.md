[![Build status](https://defradev.visualstudio.com/DEFRA_FutureFarming/_apis/build/status/defra-ff-mine-support-claim-service-spike)](https://defradev.visualstudio.com/DEFRA_FutureFarming/_build/latest?definitionId=0)

# Mine Support Claim Service
Digital service mock to claim public money in the event property subsides into mine shaft.

# Environment variables

| name                            | description        | required | default              | valid                       | notes |
|---------------------------------|--------------------|:--------:|----------------------|:---------------------------:|-------|
| NODE_ENV                        | Node environment   |    no    |                      | development,test,production |       |
| PORT                            | Port number        |    no    | 3003                 |                             |       |
| POSTGRES_USERNAME               | Postgres username  |   yes    |                      |                             |       |
| POSTGRES_PASSWORD               | Postgres password  |   yes    |                      |                             |       |
| MINE_SUPPORT_MESSAGE_QUEUE      | MQ Server hostname |    no    | mine-support-artemis |                             |       |
| MINE_SUPPORT_MESSAGE_QUEUE_PORT | MQ Server port     |    no    | 5672                 |                             |       |
| MINE_SUPPORT_MESSAGE_QUEUE_USER | MQ Server username |    no    |                      |                             |       |
| MINE_SUPPORT_MESSAGE_QUEUE_PASS | MQ Server password |    no    |                      |                             |       |

# Prerequisites

Node v10+, access to a postgress database, access to an AMQP 1.0 compatible message queue service

# Running the application

The application is ready to run:

`$ node index.js`

# Development tools setup

`$ npm install`

This will install all the development packages and test tools required.

# How to run in development

This package is a microservice which is part of the overall "mine-service" POC application. It is a REST API that can be called by posting a json object to the /submit path

# Test tools

Run unit test by running `npm test`

The tool can be run directly by running `npx jest`
