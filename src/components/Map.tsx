import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import styled from 'styled-components'
import { UpdatePoint, Location } from '../types'


const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

interface State {
  map: mapboxgl.Map
}

interface Props {
  locations: Array<Location>,
  updatePoint: UpdatePoint
}

export default class Map extends Component<Props, State> {

  mapContainer: any;

  componentDidUpdate(prevProps: Props, prevState: State) {

    const { locations } = this.props
    
    if (prevProps.locations !== locations) {
      console.log(locations)
    }
  }

  componentDidMount() {

    const { updatePoint } = this.props

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

    this.loadMap(updatePoint)
  }

  componentWillUnmount() {
    const { map } = this.state
    map && map.remove()
  }

  loadMap = (updatePoint: UpdatePoint) => {

    const mapContainer = this.mapContainer

    const map: mapboxgl.Map = new mapboxgl.Map({
      container: mapContainer,
      // style: 'mapbox://styles/mapbox/dark-v9',
      style: 'mapbox://styles/mapbox/light-v9',
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

    map.on('style.load', () => {
      map.addControl(new mapboxgl.NavigationControl());
    })

    map.on('click', (event) => {
      const { locations } = this.props
      this.handleMapClick(event, updatePoint, locations)
    });

    this.setState({ map })
  }

  handleMapClick = (event: any, updatePoint: UpdatePoint, locations: Array<Location>) => {
    console.log(event)

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

  public render() {
    return (
      <MapContainer
        ref={el => {
          this.mapContainer = el
        }}
      />
    )
  }
}
