ARG IMAGE_TAG=1.0.0

FROM ssvadpinfcr5401.azurecr.io/image/adp-postgres-migration:$IMAGE_TAG

COPY --chown=liquibase:liquibase --chmod=755 changelog ./changelog

CMD ["-Command","update", "-ChangeLogFile","/changelog/db.changelog.xml"]