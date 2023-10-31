FROM liquibase/liquibase:3.10.x

COPY --chown=node:node --chmod=444 changelog ./changelog
COPY --chown=node:node --chmod=544 scripts /scripts