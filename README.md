[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/ffc-demo-claim-service/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DEFRA/ffc-demo-claim-service?targetFile=package.json)

# FFC Demo Claim Service

Digital service mock to claim public money in the event property subsides into mine shaft.  The claim service receives claim data and if doesn't already exist saves it in a PostgreSQL database table.  It also publishes events to message queues that a new claim has been received.

## Prerequisites

- Access to an instance of an
[Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/)(ASB).
- Docker
- Docker Compose

Optional:
- Kubernetes
- Helm

### Azure Service Bus
This service depends on a valid Azure Service Bus connection string for
asynchronous communication.  The following environment variables need to be set
in any non-production (`process.env.NODE_ENV !== production`)
environment before the Docker container is started. When deployed
into an appropriately configured AKS cluster (where
[Azure Workload Identity](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview) is
configured) the micro-service will use Azure Workload Identity configured on the deployment helm template which is included in the application helm chart.

| Name                               | Description                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| MESSAGE_QUEUE_HOST                 | Azure Service Bus hostname, e.g. `myservicebus.servicebus.windows.net`                       |
| MESSAGE_QUEUE_USER                 | Azure Service Bus SAS policy name, e.g. `RootManageSharedAccessKey`                          |
| MESSAGE_QUEUE_PASSWORD             | Azure Service Bus SAS policy key                                                             |

## Environment variables

The following environment variables are required by the application container. Values for development are set in the Docker Compose configuration. Default values for production-like deployments are set in the Helm chart and may be overridden by build and release pipelines.

| Name                               | Description                     | Required   | Default     | Valid                         | Notes                                                                               |
| ---------------------------------- | -----------------------------   | :--------: | ----------- | :---------------------------: | ----------------------------------------------------------------------------------------- |
| APPINSIGHTS_INSTRUMENTATIONKEY     | Key for application insight     | no         |             |                               | App insights only enabled if key is present. Note: Silently fails for invalid key         |
| APPINSIGHTS_CLOUDROLE              | Role used for filtering metrics | no         |             |                               | Set to `ffc-demo-claim-service-local` in docker compose files                             |
| CALCULATION_QUEUE_ADDRESS          | Message queue address           | no        |             |                               |                                                                                           |
| CLAIM_QUEUE_ADDRESS                | Message queue address           | no        |             |                               |                                                                                           |
| NODE_ENV                           | Node environment                | no         |             | development,test,production   |                                                                                           |
| POSTGRES_DB                        | PostgreSQL database             | yes        |             |                               |                                                                                           |
| POSTGRES_HOST                      | PostgreSQL host                 | yes        |             |                               |                                                                                           |
| POSTGRES_USERNAME                  | PostgreSQL username             | yes        |             |                               |                                                                                           |
| POSTGRES_PASSWORD                  | PostgreSQL password             | yes        |             |                               |                                                                                           |
| POSTGRES_SCHEMA_NAME               | PostgreSQL schema               | no         | public      |                               |                                                                                           |
| POSTGRES_SCHEMA_PASSWORD           | Password of schema user         | no         | ppp         |                               | this is only used in the docker container when running against a schema other than public |
| POSTGRES_SCHEMA_USER               | schema user account             | no         | postgres    |                               | see above                                                                                 |
| SCHEDULE_QUEUE_ADDRESS             | Message queue address           | yes        |             |                               |                                                                                           |
|PACT_BROKER_URL|URL for the PACT Broker|yes|||
|PACT_BROKER_USERNAME|Username for the PACT Broker|yes|||
|PACT_BROKER_PASSWORD|Password for the PACT Broker|yes|||

## How to run tests

A convenience script is provided to run automated tests in a containerised environment. This also supports file watching by passing the optional `-w` argument.

```
# Run tests
scripts/test

# Run tests watching file
scripts/test -w
```

Running the integration tests locally requires access to ASB, this can be
achieved by setting the following environment variables:
`MESSAGE_QUEUE_HOST`, `MESSAGE_QUEUE_PASSWORD`, `MESSAGE_QUEUE_USER`.
`CALCULATION_QUEUE_ADDRESS`, `CLAIM_QUEUE_ADDRESS` & `SCHEDULE_QUEUE_ADDRESS`
must be set to valid, developer specific queues that are available on ASB e.g.
for the claim queue that would be `ffc-demo-claim-<initials>` where
`<initials>` are the initials of the developer.

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

The service uses [Liquibase](https://www.liquibase.org/) to manage database migrations. To ensure the appropriate migrations have been run the utility script `scripts/start` may be run to execute the migrations, then the application.

Alternatively the steps can be run manually:
* run migrations
  * `docker-compose -f docker-compose.migrate.yaml run --rm database-up`
* start
  * `docker-compose up`
* stop
  * `docker-compose down` or CTRL-C

Additional Docker Compose files are provided for scenarios such as linking to other running services.

Link to other services:
```
docker-compose -f docker-compose.yaml -f docker-compose.link.yaml up
```

### Database migrations
Database migrations can be run locally using the below command which applies the liquibase changelog defined in `changelog` directory by running the migration scripts in `scripts/migration`. 
```
docker-compose -f docker-compose.migrate.yaml run --rm database-up
```
While commiting the code changes to git repository, as part of CI pipeline, a new database migration image is created from `db-migration.Dockerfile` dockerfile. This contains the necessary scripts, liquibase changelog files. This image has Azure CLI installed in it and applies database migrations using Azure Workload Identity associated with the database migration job. 

### Test the message queue

This service reacts to messages retrieved from Azure Service Bus (the "ffc-demo-claim" queue). It can be tested locally with:

`docker-compose up` to start the service with a connection to the configured Azure Service Bus instance and developer queues.

Test messages can be sent via a client that supports sending to Azure Service Bus. Messages should match the format of the sample JSON below.

```
{
  "claimId":"MINE123",
  "name": "Joe Bloggs",
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

For production deployments, 2 helm charts are included in the `.\helm` folder.
- `ffc-demo-claim-service-infra` for Application infrastructure deployment (servicebus queues, topics, storage accounts) using [`adp-aso-helm-library`](https://github.com/DEFRA/adp-aso-helm-library)
- `ffc-demo-claim-service` for Application deployment using [`adp-helm-library`](https://github.com/DEFRA/adp-helm-library)

These helm charts take developer inputs from [values.yaml](/helm/ffc-demo-claim-service/values.yaml) and [values.yaml](/helm/ffc-demo-claim-service-infra/values.yaml). On running the [`CI pipeline`](.azuredevops/build.yaml) the images and helm charts are built and published to environment level Azure Container Registries.

#### Accessing the pod

By default, the service is not exposed via an endpoint within Kubernetes.

Access may be granted by forwarding a local port to the deployed pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-claim-service 3003:3003
```
Once the port is forwarded, the service can be accessed and tested in the same way as described in the "Test the service" section above.

## Build Pipeline

The [CI Pipeline](.azuredevops/build.yaml) does the following
- The application is validated
- The application is tested
- The application is built into deployable artifacts (images and helm charts)
- Pushing the artifacts to Azure Container Registry

A detailed description on the build pipeline [wiki page](https://github.com/DEFRA/ado-pipeline-common/blob/main/docs/AppBuildAndDeploy.md) 

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
