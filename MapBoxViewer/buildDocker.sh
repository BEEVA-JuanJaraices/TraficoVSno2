docker rm -f Mapbox-Tráfico
docker rmi mapbox-trafico
docker build -t mapbox-trafico . 
docker run -d -p 8888:8080 -v $(pwd)/webmap:/usr/src/app/webmap -e "MAPBOX_API_KEY=pk.eyJ1IjoibWl0aHJhbmRpcjgzIiwiYSI6ImNqMmZ6OWMzdTAwNnkzM250eWM4Z2gyODMifQ.HT1Snbmjm_3SD0QRruj-Ug" --name Mapbox-Trafico mapbox-trafico
