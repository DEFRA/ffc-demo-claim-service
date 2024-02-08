# Use Liquibase as base image
FROM liquibase/liquibase:4.25

# Change to root user for installation
USER root

# Install Azure CLI
RUN curl -skL https://aka.ms/InstallAzureCLIDeb | bash

# Copy scripts and migration changelog files
COPY --chown=liquibase:liquibase --chmod=755 changelog ./changelog
COPY --chown=liquibase:liquibase --chmod=755 scripts /scripts

# Get AAD access token and run database migration
CMD ["sh", "-c", "az login --service-principal --username $AZURE_CLIENT_ID --federated-token $(cat $AZURE_FEDERATED_TOKEN_FILE) --tenant $AZURE_TENANT_ID; ACCESS_TOKEN=$(az account get-access-token --resource-type oss-rdbms --query 'accessToken' --output tsv); export ACCESS_TOKEN; sh /scripts/migration/database-up $ACCESS_TOKEN;"]
