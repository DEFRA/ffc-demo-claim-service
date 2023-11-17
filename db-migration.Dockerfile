FROM liquibase/liquibase:3.10.x

COPY --chown=liquibase:liquibase changelog ./changelog
COPY --chown=liquibase:liquibase scripts /scripts