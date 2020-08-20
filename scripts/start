#!/usr/bin/env sh

set -e
projectRoot="$(a="/$0"; a=${a%/*}; a=${a:-.}; a=${a#/}/; cd "$a/.." || return; pwd)"

cd "${projectRoot}"
# Guarantee clean environment
docker-compose down -v
docker-compose -f docker-compose.migrate.yaml down -v
# Ensure container images are up to date
docker-compose -f docker-compose.migrate.yaml run database-up
docker-compose up --build
