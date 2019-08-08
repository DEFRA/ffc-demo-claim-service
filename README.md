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
- Access to a PostgreSQL database
- Access to an AMQP 1.0 compatible message queue service

# Running the application

The application is designed to run as a container via Docker Compose or Kubernetes (with Helm).

## Using Docker Compose

A set of convenience scripts are provided for local development and running via Docker Compose.

```
# Build service containers
scripts/build

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

Running via Helm requires a local Postgres database to be installed and setup with the username and password defined in the [values.yaml](./helm/values.yaml). It is much simpler to develop using Docker Compose locally than to set up a local Kubernetes environment. See above for instructions.

To test Helm deployments locally, a [deploy](./deploy) script is provided.

```
# Build service containers
scripts/build

# Deploy to the current Helm context
scripts/deploy
```

# How to run tests

A convenience script is provided to run automated tests in a containerised environment:

```
scripts/test
```

Alternatively, the same tests may be run locally via npm:

```
npm run test
```
