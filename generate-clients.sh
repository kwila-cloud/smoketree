#!/bin/bash
# TODO: run in GitHub Actions
# NOTE: make sure you have the JDK installed before running this script
# NOTE: The API must be running locally on port 8787
npx @openapitools/openapi-generator-cli generate -i http://localhost:8787/openapi.json -g typescript-axios -o clients/typescript --git-user-id "kwila-cloud" --git-repo-id "smoketree" --additional-properties "npmName=smoketree-ts,licenseName=MIT"
# npx @openapitools/openapi-generator-cli generate -i http://localhost:8787/openapi.json -g dart -o clients/dart --additional-properties "pubName=smoketree,packageName=smoketree"