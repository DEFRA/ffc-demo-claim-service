FROM liquibase/liquibase:3.10.x
RUN useradd -ms /bin/bash node
USER node
COPY --chmod=444 changelog ./changelog
COPY --chmod=544 scripts /scripts