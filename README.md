# Routing Service Frontend

## Usage

In order to start using this project, first clone this repo onto your local machine. 

Create a `.env` file at the root of the project and copy the contents of `.env.example` to it, replacing 
`REACT_APP_MAPBOX_TOKEN` by your personal one, available at [mapbox](www.mapbox.com).

Install dependencies with the following command:

`npm install`

And start the development server with:

`npm start`

### OSRM Backend

In order for the frontend to work you need to have an OSRM server running in the background, ideally in port 5000 (although you can adjust that through the UI on the inspect panel). The best way to achieve this is by using docker and a pre-built image as explained [here](https://hub.docker.com/r/peterevans/osrm-backend), but the basic command to start the server is the following:

```
docker run -d -p 5000:5000 -e OSRM_PBF_URL='http://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf' \
--name osrm-backend peterevans/osrm-backend:latest
```

where `OSRM_PBF_URL` points to the geographic area pbf file you want to route on. You can check [Geofabrik's webpage](https://download.geofabrik.de/) for the correct paths to the files of geographic areas you want to serve.

## Contributing

Pull Requests are welcome!
