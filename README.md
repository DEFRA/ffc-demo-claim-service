[![Build status](https://defradev.visualstudio.com/DEFRA_FutureFarming/_apis/build/status/defra-ff-mine-support-claim-service)](https://defradev.visualstudio.com/DEFRA_FutureFarming/_build/latest?definitionId=563)

# Mine Support Claim Service
Digital service mock to claim public money in the event property subsides into mine shaft.  The claim service receives claim data and if doesn’t already exist saves it in a Postgresql database table.  It also publishes events to message queues that a new claim has been received.

# Environment variables
|Name|Description|Required|Default|Valid|Notes|
|---|---|:---:|---|---|---|
|NODE_ENV|Node environment|no|development|development,test,production||
|PORT|Port number|no|3003|||
|POSTGRES_USERNAME|Postgres username|yes||||
|POSTGRES_PASSWORD|Postgres password|yes||||
|MINE_SUPPORT_MESSAGE_QUEUE|Message queue url|no|amqp://localhost|||

# Prerequisites
Node v10+
PostgreSQL
Message queue - amqp protocol

# Running the application
The application is designed to run as a container via Docker Compose or Kubernetes (with Helm).

A convenience script is provided to run via Docker Compose:

`scripts/start`

This will create the required `mine-support` network before starting the service so that it can communicate with other Mine Support services running alongside it through docker-compose. The script will then attach to the running service, tailing its logs and allowing the service to be brought down by pressing `Ctrl + C`.

# Kubernetes
The service has been developed with the intention of running in Kubernetes.  A helm chart is included in the `.\helm` folder.

# How to run tests
Unit tests are written in Lab and can be run with the following command:

`npm run test`
