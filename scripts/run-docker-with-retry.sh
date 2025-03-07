#!/bin/bash

# Step 1: Remove the existing 'nextrealm_demo_container' if it exists
echo "Checking if 'nextrealm_demo_container' exists and removing it if found..."
docker ps -a --filter "name=nextrealm_demo_container" | grep "nextrealm_demo_container" && docker rm -f nextrealm_demo_container

# Step 2: Ensure the container is fully removed
echo "Waiting for 'nextrealm_demo_container' to be completely removed..."
while docker ps -a | grep "nextrealm_demo_container"; do
    echo "Container still exists, waiting..."
    sleep 1
done
echo "'nextrealm_demo_container' successfully removed."

# Step 3: Build the Docker image
echo "Building the Docker image 'nextrealm'..."
docker build -t nextrealm .

# Step 4: Run a new container
echo "Running a new container named 'nextrealm_demo_container' on ports 5678 and 6052..."
docker run -d -p 5678:5678 -p 6052:6052 --name nextrealm_demo_container nextrealm

echo "Setup complete!"
