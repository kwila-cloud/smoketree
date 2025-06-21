#!/bin/bash
# TODO: run in GitHub Actions
# NOTE: The API must be running locally on port 8787
npx @openapitools/openapi-generator-cli generate -i http://localhost:8787/openapi.json -g typescript-axios -o clients/typescript --additional-properties "npmName=smoketree"
npx @openapitools/openapi-generator-cli generate -i http://localhost:8787/openapi.json -g dart -o clients/dart --additional-properties "pubName=smoketree,packageName=smoketree"