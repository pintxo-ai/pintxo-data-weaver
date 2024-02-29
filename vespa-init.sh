#!/bin/bash

# Start Vespa
#/opt/vespa/bin/vespa-start-services && echo "Vespa services started."
# docker run --detach --name vespa --hostname pintxo-engine --publish 8080:8080 --publish 19071:19071 vespaengine/vespa && echo "Vespa services started."

# Wait for Vespa to be fully up
until curl -s http://localhost:19071/ApplicationStatus
do
  echo "Waiting for Vespa to be fully up..."
  sleep 5
done

# Run your specific Vespa commands
vespa status deploy --wait 300
vespa deploy --wait 300 engine-v1/

# Keep the container running
tail -f /dev/null

