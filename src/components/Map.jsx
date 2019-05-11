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

export default class Map extends Component {
  static defaultProps = {
    initialSourceName: 'san-francisco-json',
    initialLayerId: 'san-francisco-lines',
    mapToken:
      'pk.eyJ1IjoiZGlvZ29tYXRvc2NoYXZlcyIsImEiOiJjanQ4ZnN6OHAwN3F2M3ltcndlZmdlcDRqIn0.HvTPjIfYeEqK2FT_SMplbQ',
    trafficProfiles: ['All', 'lua profile', 'traffic-update'],
    speedsId: 'speeds2'
  }

  state = {}

  componentDidMount() {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      hash: true,
      maxZoom: 24.999,
      minZoom: 1,
      zoom: 4,
      center: [13.4147, 52.502],
      transformRequest: (url, resourceType) => {
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
      // Triggered when `setStyle` is called.
      // this.addGeoJsonLayer();
      // Promise.resolve(this.addVectorTiles()).then(sourceNames => {
      //   sourceNames.forEach(source => {
      //     const layers = map.getStyle().layers.filter(layer => layer.id.includes(source))
      //     layers.forEach(layer => {
      //       map.setLayoutProperty(layer.id, 'visibility', 'none')
      //     })
      //   })
      // })
      // Promise.resolve(this.addSpeedsLayer()).then(sourceNames => {
      //   sourceNames.forEach(source => {
      //     const layers = map.getStyle().layers.filter(layer => layer.id.includes(source))
      //     layers.forEach(layer => {
      //       map.setLayoutProperty(layer.id, 'visibility', 'none')
      //     })
      //   })
      //   this.addMapInspect(map)
      // })
    })
  }

  componentWillUnmount() {
    const { map } = this.state

    map.remove()
  }

  render() {
    return (
      <MapContainer
        ref={el => {
          this.mapContainer = el
        }}
      />
    )
  }
}
