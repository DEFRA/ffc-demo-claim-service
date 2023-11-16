# Use Liquibase as base image
FROM liquibase/liquibase:4.25

# Install curl and gnupg2
USER root
RUN apt-get update && apt-get install -y curl gnupg2

# Install Azure CLI
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# Copy scripts and migration changelog files
COPY --chown=liquibase:liquibase changelog ./changelog
COPY --chown=liquibase:liquibase scripts /scripts

# Get AAD access token and run database migration
CMD ["sh", "-c", "echo $AZURE_CLIENT_ID; az login --service-principal --username $AZURE_CLIENT_ID --federated-token $(cat $AZURE_FEDERATED_TOKEN_FILE) --tenant $AZURE_TENANT_ID; ACCESS_TOKEN=$(az account get-access-token --resource-type oss-rdbms --query 'accessToken' --output tsv); export ACCESS_TOKEN; /scripts/migration/database-up $ACCESS_TOKEN;"]

