[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/ffc-demo-claim-service/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DEFRA/ffc-demo-claim-service?targetFile=package.json)

# FFC Demo Claim Service

Digital service mock to claim public money in the event property subsides into mine shaft.  The claim service receives claim data and if doesn't already exist saves it in a PostgreSQL database table.  It also publishes events to message queues that a new claim has been received.

## Prerequisites

- Azure Service Bus instance

Either:
- Docker
- Docker Compose

Or:
- Kubernetes
- Helm

### Azure Service Bus
This service depends on a valid Azure Service Bus connection string for
asynchronous communication.  The following environment variables need to be set
in any non-production (`!config.isProd`) environment before the Docker
container is started. When deployed into an appropriately configured AKS
cluster (where [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) is
configured) the micro-service will use AAD Pod Identity through the manifests
for
[azure-identity](./helm/ffc-demo-claim-service/templates/azure-identity.yaml)
and
[azure-identity-binding](./helm/ffc-demo-claim-service/templates/azure-identity-binding.yaml).

| Name                               | Description                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| MESSAGE_QUEUE_HOST                 | Azure Service Bus hostname, e.g. `myservicebus.servicebus.windows.net`                       |
| MESSAGE_QUEUE_USER                 | Azure Service Bus SAS policy name, e.g. `RootManageSharedAccessKey`                          |
| MESSAGE_QUEUE_PASSWORD             | Azure Service Bus SAS policy key                                                             |
| MESSAGE_QUEUE_SUFFIX               | Developer specific queue suffix to prevent collisions, only required for local development   |

## Environment variables

The following environment variables are required by the application container. Values for development are set in the Docker Compose configuration. Default values for production-like deployments are set in the Helm chart and may be overridden by build and release pipelines.

| Name                               | Description                     | Required   | Default     | Valid                         | Notes                                                                               |
| ---------------------------------- | -----------------------------   | :--------: | ----------- | :---------------------------: | ----------------------------------------------------------------------------------- |
| APPINSIGHTS_INSTRUMENTATIONKEY     | Key for application insight     | no         |             |                               | App insights only enabled if key is present. Note: Silently fails for invalid key   |
| APPINSIGHTS_CLOUDROLE              | Role used for filtering metrics | no         |             |                               | Set to `ffc-demo-claim-service-local` in docker compose files                       |
| CALCULATION_QUEUE_ADDRESS          | Message queue address           | yes        |             |                               |                                                                                     |
| CLAIM_QUEUE_ADDRESS                | Message queue address           | yes        |             |                               |                                                                                     |
| NODE_ENV                           | Node environment                | no         |             | development,test,production   |                                                                                     |
| PORT                               | Port number                     | no         | 3003        |                               |                                                                                     |
| POSTGRES_DB                        | PostgreSQL database             | yes        |             |                               |                                                                                     |
| POSTGRES_USERNAME                  | PostgreSQL username             | yes        |             |                               |                                                                                     |
| POSTGRES_PASSWORD                  | PostgreSQL password             | yes        |             |                               |                                                                                     |
| SCHEDULE_QUEUE_ADDRESS             | Message queue address           | yes        |             |                               |                                                                                     |

## How to run tests

A convenience script is provided to run automated tests in a containerised environment. The first time this is run, container images required for testing will be automatically built. An optional `--build` (or `-b`) flag may be used to rebuild these images in future (for example, to apply dependency updates).

```
# Run tests
scripts/test

# Rebuild images and run tests
scripts/test --build
```

This runs tests via a `docker-compose run` command. If tests complete successfully, all containers, networks and volumes are cleaned up before the script exits. If there is an error or any tests fail, the associated Docker resources will be left available for inspection.

Alternatively, unit tests may be run locally via npm:

```
# Run unit tests without Docker
npm run test:unit
```

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

By default, the start script will build (or rebuild) images so there will rarely be a need to build images manually. However, this can be achieved through the Docker Compose [build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Start and stop the service

Use Docker Compose to run service locally.

`docker-compose up`

Additional Docker Compose files are provided for scenarios such as linking to other running services.

Link to other services:
```
docker-compose -f docker-compose.yaml -f docker-compose.link.yaml up
```

### Test the service

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
{  "claimId": "MINE123",  "propertyType": "business",  "accessible": false,  "dateOfSubsidence": "2019-07-26T09:54:19.622Z",  "mineType": ["gold"] }
```

### Test the message queue

This service reacts to messages retrieved from Azure Service Bus (the "ffc-demo-claim" queue). It can be tested locally with:

`docker-compose up` to start the service with a connection to the configured Azure Service Bus instance and developer queues.

Test messages can be sent via a client that supports sending to Azure Service Bus. Messages should match the format of the sample JSON below.

```
{
  "claimId":"MINE123",
  "propertyType":"business",
  "accessible":false,
  "dateOfSubsidence":"2019-07-26T09:54:19.622Z",
  "mineType":["gold"],
  "email":"joe.bloggs@defra.gov.uk"
}
```

### Link to sibling services

To test interactions with sibling services in the FFC demo application, it is necessary to connect each service to an external Docker network, along with shared dependencies such as message queues. The most convenient approach for this is to start the entire application stack from the [`ffc-demo-development`](https://github.com/DEFRA/ffc-demo-development) repository.

It is also possible to run a limited subset of the application stack. See the [`ffc-demo-development`](https://github.com/DEFRA/ffc-demo-development) Readme for instructions.

### Deploy to Kubernetes

For production deployments, a helm chart is included in the `.\helm` folder. This service connects to an AMQP message broker, using credentials defined in [values.yaml](./helm/ffc-demo-claim-service/values.yaml), which must be made available prior to deployment.

Scripts are provided to test the Helm chart by deploying the service, along with an appropriate message broker, into the current Helm/Kubernetes context.

```
# Deploy to current Kubernetes context
scripts/helm/install

# Remove from current Kubernetes context
scripts/helm/delete
```

#### Accessing the pod

By default, the service is not exposed via an endpoint within Kubernetes.

Access may be granted by forwarding a local port to the deployed pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-claim-service 3003:3003
```
Once the port is forwarded, the service can be accessed and tested in the same way as described in the "Test the service" section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

# Run the NPM update
scripts/exec npm update

# Rebuild and restart the service
scripts/start --clean

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

