FROM liquibase/liquibase:3.10.x

COPY --chmod=444 changelog ./changelog
COPY --chmod=544 scripts /scripts