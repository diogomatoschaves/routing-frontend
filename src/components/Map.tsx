import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import styled from 'styled-components'
import { UpdatePoint, Location, Coords2 } from '../types'
import { routeLineSettings, emptyLineString } from '../utils/input'
import { transformPoints } from '../utils/functions'


const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

interface State {
  map?: mapboxgl.Map,
  markers: Array<mapboxgl.Marker>
}

interface Props {
  locations: Array<Location>,
  updatePoint: UpdatePoint,
  routePath: Array<Coords2>
}

export default class Map extends Component<Props, State> {

  mapContainer: any;

  constructor(props: Props) {
    super(props)
    this.state = {
      ...(process.env.NODE_ENV === 'test' && { map: new mapboxgl.Map }),
      markers: []
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { locations, routePath } = this.props
    const { map, markers } = this.state
    
    if (map && prevProps.locations !== locations) {

      this.removeMarkers(markers)
      const newMarkers = locations.reduce((accum: Array<mapboxgl.Marker>, location: Location) => {
        if (location.lng && location.lat) {
          return [...accum, this.addMarker(location, map)]
        } else return accum
      }, [])
      this.setState({ markers: newMarkers })
    }

    if (map && prevState.markers !== markers) {
      const points = this.getMarkerCoords(markers)
      this.fitBounds(points, map)
    }

    if (map && prevProps.routePath !== routePath) {
      const routeCoords = transformPoints(routePath)
      const points = this.getMarkerCoords(markers)
      this.addRoute(routeCoords, map)
      this.fitBounds([...points, ...routeCoords], map)
    }
  }

  componentDidMount() {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || ''
    this.loadMap()
  }

  componentWillUnmount() {
    const { map } = this.state
    map && map.remove()
  }

  private loadMap = () => {

    const mapContainer = this.mapContainer

    const map: mapboxgl.Map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      // style: 'mapbox://styles/mapbox/light-v9',
      hash: true,
      maxZoom: 24.999,
      minZoom: 1,
      zoom: 4,
      center: [13.4147, 52.502],
      transformRequest: (url: any, resourceType: any): any => {
        if (url.includes('routing')) {
          return {
            url,
            method: 'GET',
            headers: {
              Authorization: 'Basic RE1BVE9TQzpPbGlzc2lwbzE5ODY=',
              method: 'GET'
            }
          }
        }
      }
    })

    map.on('style.load', () => map.addControl(new mapboxgl.NavigationControl(), 'bottom-right'))

    map.on('load', () => this.setState({ map }))

    map.on('click', (event) => this.handleMapClick(event));
  }

  private handleMapClick = (event: any) => {

    const { updatePoint, locations } = this.props

    const coords = {
      lat: event.lngLat.lat,
      lng: event.lngLat.lng,
    }

    if (!locations[0].lat || !locations[0].lng) {
      updatePoint(0, coords)
    } else {
      updatePoint(locations.length - 1, coords)
    }
  }

  private addMarker = (location: Location, map: mapboxgl.Map) => {
    const el = document.createElement('i');
    el.className = `${location.marker} icon custom-marker`

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
      offset: location.markerOffset && new mapboxgl.Point(location.markerOffset[0], location.markerOffset[1]),
      draggable: true,
    })
      .setLngLat([location.lng ? location.lng : 0, location.lat ? location.lat : 0])
      .addTo(map);

    return marker
  }

  private removeMarkers = (markers: Array<mapboxgl.Marker>) => {
    markers.forEach(marker => marker && marker.remove())
    this.setState({ markers: []})
  }

  private getMarkerCoords = (markers: Array<mapboxgl.Marker>): number[][] => {
    return markers.map((marker: mapboxgl.Marker) => {
      const coords = marker && marker.getLngLat()
      return coords ? [coords.lng, coords.lat] : []
    })
  }

  private fitBounds = (coords: number[][], map: mapboxgl.Map) => {

    let bounds = new mapboxgl.LngLatBounds()

    if (coords.length === 1) {
      map.flyTo({
        center: new mapboxgl.LngLat(coords[0][0], coords[0][1]),
        speed: 0.4,
      })
      return
    }

    coords.forEach(coord => {
      const point = new mapboxgl.LngLat(coord[0], coord[1])
      bounds.extend(point)
    })

    map.fitBounds(bounds, {
      padding: {
        top: 350,
        left: 450,
        right: 200,
        bottom: 120
      },
      linear: true,
      easing: (time: number) => time,
    });
  }

  private removeSourceLayer = (sourceName: string, map: mapboxgl.Map) => {
    const styles = map.getStyle()
  
    Promise.resolve(
      styles && styles.layers && styles.layers.filter(layer => layer.id.includes(sourceName)).forEach(layer => {
        map.removeLayer(layer.id)
      })
    )
    .then(() => map.getSource(sourceName) && map.removeSource(sourceName))
  }

  private addRoute = (routePath: number[][], map: mapboxgl.Map) => {

    Promise.resolve(this.removeSourceLayer('route', map))
    .then(() => {
      return map.addSource('route', {
        'type': 'geojson',
        // 'data': ''
        'data': {
          ...emptyLineString as any,
          features: [{
            ...emptyLineString.features[0],
            geometry: {
              ...emptyLineString.features[0].geometry,
              coordinates: routePath
            }
          }]
        }
      })
    })
    .then(() => {
      map.addLayer({
        ...routeLineSettings as any,
        id: `route-polyline`,
        source: 'route'
      });
    })
  }

  public render() {
    return <MapContainer ref={el => this.mapContainer = el} />
  }
}
