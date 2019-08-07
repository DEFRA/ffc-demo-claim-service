[![Build status](https://defradev.visualstudio.com/DEFRA_FutureFarming/_apis/build/status/defra-ff-mine-support-claim-service)](https://defradev.visualstudio.com/DEFRA_FutureFarming/_build/latest?definitionId=563)

# Mine Support Claim Service
Digital service mock to claim public money in the event property subsides into mine shaft.  The claim service receives claim data and if doesn’t already exist saves it in a Postgresql database table.  It also publishes events to message queues that a new claim has been received.

# Environment variables

| Name                            | Description        | Required | Default              | Valid                       | Notes |
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

- Node v10+
- access to a postgress database
- access to an AMQP 1.0 compatible message queue service

# Running the application
The application is designed to run as a container via Docker Compose or Kubernetes (with Helm).

## Using Docker Compose
A set of convenience scripts are provided for local development and running via Docker Compose.

```
# Build service containers
scripts/setup

# Start the service and attach to running containers (press `ctrl + c` to quit)
scripts/start

# Stop the service and remove Docker volumes and networks created by the start script
scripts/stop
```

Any arguments given to the start script are passed through to the `docker-compose up` command. For example, this allows the service to be started without attaching to containers:

```
# Start the service without attaching to containers
scripts/start --detach
```

This service depends on an external Docker network named `mine-support` to communicate with other Mine Support services running alongside it. The start script will automatically create the network if it doesn't exist and the stop script will remove the network if no other containers are using it.

## Using Kubernetes
The service has been developed with the intention of running on Kubernetes in production.  A helm chart is included in the `.\helm` folder.

# Development tools setup

`$ npm install`

This will install all the development packages and test tools required.

# How to run in development

This package is a microservice which is part of the overall "mine-service" POC application. It is a REST API that can be called by posting a json object to the /submit path

# Test tools

Run unit test by running `npm test`

The tool can be run directly by running `npx jest`
