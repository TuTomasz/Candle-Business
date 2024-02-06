#!/bin/bash

# Check if the flag file exists
if [ ! -f /app/data/initialized ]; then

  dockerize -wait tcp://postgres:5432 -timeout 60s

  echo "Initializing... (run migrations after wait)"

  pnpm run migrate:up

  # Create the flag file to indicate initialization
  #touch /app/data/initialized
fi

# Start your application
exec pnpm start