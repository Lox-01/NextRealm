docker ps -a --filter \"name=nextrealm_demo_container\" | docker rm -f nextrealm_demo_container && while docker ps -a | grep \"nextrealm_demo_container\"; do sleep 1; done

docker build -t nextrealm .
docker run -d -p 5678:5678 -p 6052:6052 --name nextrealm_demo_container nextrealm