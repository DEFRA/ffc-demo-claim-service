[![Build Status](https://defradev.visualstudio.com/DEFRA_FutureFarming/_apis/build/status/defra-ffc-demo-claim-service?branchName=master)](https://defradev.visualstudio.com/DEFRA_FutureFarming/_build/latest?definitionId=613&branchName=master)

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
| MINE_SUPPORT_MESSAGE_QUEUE      | MQ Server hostname |    no    | mine-support-artemis |                             |       |
| MINE_SUPPORT_MESSAGE_QUEUE_PORT | MQ Server port     |    no    | 5672                 |                             |       |
| MINE_SUPPORT_MESSAGE_QUEUE_USER | MQ Server username |    no    |                      |                             |       |
| MINE_SUPPORT_MESSAGE_QUEUE_PASS | MQ Server password |    no    |                      |                             |       |

# How to run tests

A convenience script is provided to run automated tests in a containerised environment:

```
scripts/test
```

This runs tests via a `docker-compose run` command. If tests complete successfully, all containers, networks and volumes are cleaned up before the script exits. If there is an error or any tests fail, the associated Docker resources will be left available for inspection.

Alternatively, the same tests may be run locally via npm:

```
npm run test
```

# Running the application

The application is designed to run in containerised environments: Docker Compose for development; Kubernetes for production.

A Helm chart is provided for deployment to Kubernetes and scripts are provided for local development and testing.

## Build container image

Container images are built using Docker Compose and the same image may be run in either Docker Compose or Kubernetes.

The [`build`](./scripts/build) script is essentially a shortcut and will pass any arguments through to the `docker-compose build` command.

```
# Build images using default Docker behaviour
scripts/build

# Build images without using the Docker cache
scripts/build --no-cache
```

## Run as an isolated service

To test this service in isolation, use the provided scripts to start and stop a local instance. This relies on Docker Compose and will run direct dependencies, such as message queues and databases, as additional containers. Arguments given to the [`start`](./scripts/start) script will be passed through to the `docker-compose up` command.

```
# Start the service and attach to running containers (press `ctrl + c` to quit)
scripts/start

# Start the service without attaching to containers
scripts/start --detach

# Send a sample request to the /submit endpoint
curl  -i --header "Content-Type: application/json" \
  --request POST \
  --data '{ "claimId": "MINE123", "propertyType": "business",  "accessible": false,   "dateOfSubsidence": "2019-07-26T09:54:19.622Z",  "mineType": ["gold"] }' \
  http://localhost:3003/submit

# Stop the service and remove Docker volumes and networks created by the start script
scripts/stop
```

## Connect to sibling services

To test this service in combination with other parts of the service, it is necessary to connect each service to an external Docker network and shared dependencies, such as message queues. Start the shared dependencies from the [`ffc-demo-development`](https://github.com/DEFRA/mine-support-development) repository and then use the `connected-` [`scripts`](./scripts/) to start this service. Follow instructions in other repositories to connect each service to the shared dependencies and network.

```
# Start the service
script/connected-start

# Stop the service
script/connected-stop
```

## Deploy to Kubernetes

For production deployments, a helm chart is included in the `.\helm` folder. This service connects to an AMQP 1.0 message broker and PostgreSQL database, using credentials defined in [values.yaml](./helm/values.yaml), which must be made available prior to deployment.

Scripts are provided to test the Helm chart by deploying the service, along with an appropriate message broker and database, into the current Helm/Kubernetes context.

```
# Deploy to current Kubernetes context
scripts/helm/install

# Remove from current Kubernetes context
scripts/helm/delete
```

### Accessing the pod

The ffc-demo-claim-service is not exposed via an endpoint within Kubernetes.

The deployment may be accessed by forwarding a port from a pod.
First find the name of the pod by querying the namespace, i.e.

`kubectl get pods --namespace ffc-demo-claim-service-pr5`

This will list the full name of all the pods in the namespace. Forward the pods exposed port 3003
to a local port using the name returned from the previous command, i.e.

`kubectl port-forward --namespace ffc-demo-claim-service-pr5 ffc-demo-claim-service-8b666f545-g477t  3003:3003`

Once the port is forwarded a tool such as [Postman](https://www.getpostman.com/) can be used to access the API at http://localhost:3003/submit.
Sample valid JSON that can be posted is:

```
{
  "claimId": "MINE123",
  "propertyType": "business",
  "accessible": false,
  "dateOfSubsidence": "2019-07-26T09:54:19.622Z",
  "mineType": ["gold"]
}
```

 Alternatively, curl can be used to send a request to the end point:

```
curl  -i --header "Content-Type: application/json" \
  --request POST \
  --data '{ "claimId": "MINE123", "propertyType": "business",  "accessible": false,   "dateOfSubsidence": "2019-07-26T09:54:19.622Z",  "mineType": ["gold"] }' \
  http://localhost:3003/submit
```

### Probes

The service has both an Http readiness probe and an Http liveness probe configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

# Build Pipeline

The [azure-pipelines.yaml](azure-pipelines.yaml) performs the following tasks:
- Runs unit tests
- Publishes test result
- Pushes containers to the registry tagged with the PR number or release version
- Deletes PR deployments, containers, and namepace upon merge

Builds will be deployed into a namespace with the format `ffc-demo-claim-service-{identifier}` where `{identifier}` is either the release version, the PR number, or the branch name.

A detailed description on the build pipeline and PR work flow is available in the [Defra Confluence page](https://eaflood.atlassian.net/wiki/spaces/FFCPD/pages/1281359920/Build+Pipeline+and+PR+Workflow)
