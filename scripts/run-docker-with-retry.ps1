# Stop and remove containers matching the name
docker ps -a --filter "name=nextrealm_demo_container" | ForEach-Object { 
    docker rm -f nextrealm_demo_container
}

# Wait until the container is fully removed
while (docker ps -a | Select-String "nextrealm_demo_container") { 
    Start-Sleep -Seconds 1 
}

# Build the Docker image
Write-Output "Building Docker image: nextrealm"
docker build -t nextrealm .

# Run the Docker container
Write-Output "Running Docker container: nextrealm_demo_container"
docker run -d -p 5678:5678 -p 6052:6052 --name nextrealm_demo_container nextrealm
