[![Build Status](https://defradev.visualstudio.com/DEFRA_FutureFarming/_apis/build/status/defra-ffc-demo-claim-service?branchName=master)](https://defradev.visualstudio.com/DEFRA_FutureFarming/_build/latest?definitionId=613&branchName=master)
[![Known Vulnerabilities](https://snyk.io//test/github/DEFRA/ffc-demo-claim-service/badge.svg?targetFile=package.json)](https://snyk.io//test/github/DEFRA/ffc-demo-claim-service?targetFile=package.json)

# FFC Demo Claim Service

Digital service mock to claim public money in the event property subsides into mine shaft.  The claim service receives claim data and if doesn’t already exist saves it in a Postgresql database table.  It also publishes events to message queues that a new claim has been received.

# Prerequisites

Either:
- Docker
- Docker Compose

Or:
- Kubernetes
- Helm

Or:
- Node 10
- PostgreSQL database
- AMQP 1.0 message queue

# Environment variables

The following environment variables are required by the application container. Values for development are set in the Docker Compose configuration. Default values for production-like deployments are set in the Helm chart and may be overridden by build and release pipelines.

| Name                            | Description        | Required | Default              | Valid                       | Notes |
|---------------------------------|--------------------|:--------:|----------------------|:---------------------------:|-------|
| NODE_ENV                        | Node environment   |    no    |                      | development,test,production |       |
| PORT                            | Port number        |    no    | 3003                 |                             |       |
| POSTGRES_DB                     | Postgres database  |   yes    |                      |                             |       |
| POSTGRES_USERNAME               | Postgres username  |   yes    |                      |                             |       |
| POSTGRES_PASSWORD               | Postgres password  |   yes    |                      |                             |       |
| MESSAGE_QUEUE_HOST              | MQ Server hostname |    no    | mine-support-artemis |                             |       |
| MESSAGE_QUEUE_PORT              | MQ Server port     |    no    | 5672                 |                             |       |
| MESSAGE_QUEUE_USER              | MQ Server username |    no    |                      |                             |       |
| MESSAGE_QUEUE_PASS              | MQ Server password |    no    |                      |                             |       |
| MESSAGE_QUEUE_RECONNECT_LIMIT   | MQ reconnect limit |    no    | 10                   |                             |       |
| MESSAGE_QUEUE_TRANSPORT         | MQ transport       |    no    | tcp                  | tcp,ssl                     |       |

# How to run tests

A convenience script is provided to run automated tests in a containerised environment. The first time this is run, container images required for testing will be automatically built. An optional `--build` (or `-b`) flag may be used to rebuild these images in future (for example, to apply dependency updates).

```
# Run tests
scripts/test

# Rebuild images and run tests
scripts/test --build
```

This runs tests via a `docker-compose run` command. If tests complete successfully, all containers, networks and volumes are cleaned up before the script exits. If there is an error or any tests fail, the associated Docker resources will be left available for inspection.

Alternatively, the same tests may be run locally via npm:

```
# Run tests without Docker
npm run test
```

# Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- Scripts are provided to aid local development and testing using Docker Compose.
- A Helm chart is provided for production deployments to Kubernetes.

## Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

By default, the start script will build (or rebuild) images so there will rarely be a need to build images manually. However, this can be achieved through the Docker Compose [build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

## Start and stop the service

Use the provided [`start`](./scripts/start) and [`stop`](./scripts/stop) scripts to run the service locally via Docker Compose. Both scripts accept a number of flags to customise their behaviour. For full instructions on the flags available to each script, use the `--help` or `-h` flag:

```
# View instructions for the start script
scripts/start --help

# View instructions for the stop script
scripts/stop --help
```

By default, the start script will build new container images before starting the service on an isolated Docker network along with any direct dependencies, such as message queues and databases. It will not automatically replace existing containers or volumes, but will warn if there is a conflict and abort the request. Use the `--clean` or `--quick` flags to instruct the script to replace or keep existing resources, respectively.

The underlying `docker-compose up/down` commands can be customised by appending `-- [DOCKER_COMPOSE_ARGS]` after any other arguments to the `start/stop` scripts. For example:

```
# Start the service without attaching to logs
scripts/start -- --detach
```

## Test the service

The service binds to a port on the host machine so it can be tested manually by sending HTTP requests to the bound port using a tool such as [Postman](https://www.getpostman.com) or `curl`.

```
# Send a sample request to the /submit endpoint
curl  -i --header "Content-Type: application/json" \
  --request POST \
  --data '{ "claimId": "MINE123", "propertyType": "business",  "accessible": false,   "dateOfSubsidence": "2019-07-26T09:54:19.622Z",  "mineType": ["gold"] }' \
  http://localhost:3003/submit
```

Sample valid JSON for the `/submit` endpoint is:

```
{
  "claimId": "MINE123",
  "propertyType": "business",
  "accessible": false,
  "dateOfSubsidence": "2019-07-26T09:54:19.622Z",
  "mineType": ["gold"]
}
```

## Link to sibling services

To test interactions with sibling services in the FFC demo application, it is necessary to connect each service to an external Docker network, along with shared dependencies such as message queues. The most convenient approach for this is to start the entire application stack from the [`ffc-demo-development`](https://github.com/DEFRA/ffc-demo-development) repository.

It is also possible to run a limited subset of the application stack, using the [`start`](./scripts/start) script's `--link` flag to join each service to the shared Docker network. See the [`ffc-demo-development`](https://github.com/DEFRA/ffc-demo-development) Readme for instructions.

## Deploy to Kubernetes

For production deployments, a helm chart is included in the `.\helm` folder. This service connects to an AMQP 1.0 message broker, using credentials defined in [values.yaml](./helm/ffc-demo-claim-service/values.yaml), which must be made available prior to deployment.

Scripts are provided to test the Helm chart by deploying the service, along with an appropriate message broker, into the current Helm/Kubernetes context.

```
# Deploy to current Kubernetes context
scripts/helm/install

# Remove from current Kubernetes context
scripts/helm/delete
```

### Accessing the pod

By default, the service is not exposed via an endpoint within Kubernetes.

Access may be granted by forwarding a local port to the deployed pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-claim-service 3003:3003
```

Once the port is forwarded, the service can be accessed and tested in the same way as described in the "Test the service" section above.

### Probes

The service has both an Http readiness probe and an Http liveness probe configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

# Dependency management

Dependencies should be managed within a container using the development image for the app. This will ensure that any packages with environment-specific variants are installed with the correct variant for the contained environment, rather than the host system which may differ between development and production.

The [`exec`](./scripts/exec) script is provided to run arbitrary commands, such as npm, in a running service container. If the service is not running when this script is called, it will be started for the duration of the command and then removed.

Since dependencies are installed into the container image, a full build should always be run immediately after any dependency change.

In development, the `node_modules` folder is mounted to a named volume. This volume must be removed in order for dependency changes to propagate from the rebuilt image into future instances of the app container. The [`start`](./scripts/start) script has a `--clean` (or `-c`) option  which will achieve this.

The following example will update all npm dependencies, rebuild the container image and replace running containers and volumes:

```
# Run the NPM update
scripts/exec npm update

# Rebuild and restart the service
scripts/start --clean
```

# Build Pipeline

The [azure-pipelines.yaml](azure-pipelines.yaml) performs the following tasks:
- Runs unit tests
- Publishes test result
- Pushes containers to the registry tagged with the PR number or release version
- Deletes PR deployments, containers, and namepace upon merge

Builds will be deployed into a namespace with the format `ffc-demo-claim-service-{identifier}` where `{identifier}` is either the release version, the PR number, or the branch name.

A detailed description on the build pipeline and PR work flow is available in the [Defra Confluence page](https://eaflood.atlassian.net/wiki/spaces/FFCPD/pages/1281359920/Build+Pipeline+and+PR+Workflow)
