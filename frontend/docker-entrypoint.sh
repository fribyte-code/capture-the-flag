#!/bin/sh
# Used to pass environment variables to the JS code on docker image run
# Example: It enables us to change where the backend is located without
# building a new docker image

set -euo pipefail

# Capture all environment variables starting with APP_ and make JSON string from them
ENV_JSON="$(jq --compact-output --null-input 'env | with_entries(select(.key | startswith("APP_")))')"

# Escape sed replacement's special characters: \, &, /.
# No need to escape newlines, because --compact-output already removed them.
# Inside of JSON strings newlines are already escaped.
ENV_JSON_ESCAPED="$(printf "%s" "${ENV_JSON}" | sed -e 's/[\&/]/\\&/g')"

sed -i "s/<noscript id=\"env-insertion-point\"><\/noscript>/<script>var env=${ENV_JSON_ESCAPED}<\/script>/g" /app/index.html

exec "$@"