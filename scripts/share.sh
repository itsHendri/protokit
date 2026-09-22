#!/usr/bin/env bash
# Publish the current JS to the `main` channel and print the links people need.
#
#   npm run share -- "what changed"
#
# Requires: `eas login` once, and a development build of this app installed on the
# recipient's phone (built with `eas build --profile development`). Expo Go on a phone
# also works, but only when that phone's Expo Go is signed into the h3nners-prototypes org.
set -euo pipefail
cd "$(dirname "$0")/.."

MESSAGE="${1:-update}"
PROJECT_ID=$(node -p "require('./app.json').expo.extra.eas.projectId")

eas update --branch main --channel main --message "$MESSAGE" --environment production --non-interactive

cat <<LINKS

Channel link (always the newest publish):
  exp://u.expo.dev/${PROJECT_ID}?channel-name=main

Dashboard:
  https://expo.dev/accounts/h3nners-prototypes/projects/mobile-app-prototype-kit/updates
LINKS
