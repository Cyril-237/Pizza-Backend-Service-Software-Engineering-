#!/bin/sh

set -e

if [ -z "${1-}" ]; then
  cmd="uvicorn --host 0.0.0.0 app.main:app"
else
  cmd="$@"
fi

exec $cmd
