ARG IMAGE_TAG=0.0.1

FROM ssvadpinfcr3401.azurecr.io/image/adp-postgres-migration:$IMAGE_TAG

COPY --chown=liquibase:liquibase --chmod=755 changelog ./changelog

CMD ["-Command","update1", "-ChangeLogFile","/changelog/db.changelog.xml"]