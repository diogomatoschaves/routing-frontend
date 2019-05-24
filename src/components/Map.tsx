import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import styled from 'styled-components'

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

interface MapState {
  map: any
}

export default class Map extends Component<any, MapState> {

  mapContainer: any;

  componentDidMount() {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

    const mapContainer = this.mapContainer

    const map: any = new mapboxgl.Map({
      container: mapContainer,
      // style: 'mapbox://styles/mapbox/dark-v9',
      style: 'mapbox://styles/mapbox/light-v9',
      hash: true,
      maxZoom: 24.999,
      minZoom: 1,
      zoom: 4,
      center: [13.4147, 52.502],
      transformRequest: (url: any, resourceType: any): any => {
        if (resourceType === 'Tile' && url.includes('routing')) {
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

    this.setState({ map })

    map.on('style.load', () => {
      map.addControl(new mapboxgl.NavigationControl());
    })
  }

  componentWillUnmount() {
    const { map } = this.state

    map && map.remove()
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
