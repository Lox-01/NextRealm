# Stop and remove containers matching the name
docker ps -a --filter "name=nextrealm_test_container" | ForEach-Object { 
    docker rm -f nextrealm_test_container
}

# Wait until the container is fully removed
while (docker ps -a | Select-String "nextrealm_test_container") { 
    Start-Sleep -Seconds 1 
}

# Build the Docker image
Write-Output "Building Docker image: nextrealm"
docker build -t python-tests -f Dockerfile.tests .

# Run the Docker container
Write-Output "Running Docker container: nextrealm_test_container"
docker run -d -p 5679:5679 --name nextrealm_test_container python-tests
