FROM liquibase/liquibase:3.10.x

COPY --chown=node:node changelog ./changelog
COPY --chown=node:node scripts /scripts