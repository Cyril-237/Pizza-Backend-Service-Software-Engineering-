#!/bin/sh

# Set required env vars
TIME_OUT=60
TIME_OUT_COUNT=0

echo "http://$API_SERVER:$API_PORT/docs"

# Smoke test loop (waits until service reachable but may also time out)
while true; do
  STATUS=$(curl -s -o /dev/null -w '%{http_code}' "http://$API_SERVER:$API_PORT/docs")
  echo "$STATUS"

  if [ "$STATUS" -eq 200 ]; then
    echo "Smoke Tests successful"
    break
  elif [ "$TIME_OUT_COUNT" -gt "$TIME_OUT" ]; then
    echo "Timed out! Unable to connect to destination. Elapsed Timeout Count.. $TIME_OUT_COUNT"
    exit 1
  else
    echo "Checking Status on host http://$API_SERVER:$API_PORT/docs... $TIME_OUT_COUNT seconds elapsed"
    TIME_OUT_COUNT=$((TIME_OUT_COUNT+10))
  fi

  sleep 10
done
