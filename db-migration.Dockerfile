FROM liquibase/liquibase:3.10.x
RUN useradd -ms /bin/bash node
USER node
COPY --chown=node --chmod=444 changelog ./changelog
COPY --chown=node --chmod=544 scripts /scripts