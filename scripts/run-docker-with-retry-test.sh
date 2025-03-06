#!/bin/bash

# Step 1: Remove the existing container if it exists
echo "Checking if 'nextrealm_test_container' exists and removing it if found..."
docker ps -a --filter "name=nextrealm_test_container" | grep "nextrealm_test_container" && docker rm -f nextrealm_test_container

# Step 2: Ensure the container is fully removed
echo "Waiting for 'nextrealm_test_container' to be completely removed..."
while docker ps -a | grep "nextrealm_test_container"; do
    echo "Container still exists, waiting..."
    sleep 1
done
echo "'nextrealm_test_container' successfully removed."

# Step 3: Build the Docker image
echo "Building the Docker image 'python-tests' using Dockerfile.tests..."
docker build -t python-tests -f Dockerfile.tests .

# Step 4: Run a new container
echo "Running a new container named 'nextrealm_test_container' on port 5679..."
docker run -d -p 5679:5679 --name nextrealm_test_container nextrealm

echo "Setup complete!"
