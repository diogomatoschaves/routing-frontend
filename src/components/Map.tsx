import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import styled from 'styled-components'
import {
  UpdatePoint,
  UpdateState,
  Location,
  Coords2,
  Geography,
  MapboxStyle,
  Route
} from '../types'
import {
  routeLineSettings,
  emptyLineString,
  speedTilesInput,
  defaultRouteResponse
} from '../utils/input'
import { transformPoints, getSpeedsLayers } from '../utils/functions'
import { POLYLINE_COLOR, THIRD_PARTY_POLYLINE, TRAFFIC_PARTY_POLYLINE } from '../utils/colours'

const MapWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

interface State {
  map?: mapboxgl.Map
  markers: Array<mapboxgl.Marker>
  style: string
}

interface Props {
  locations: Array<Location>
  profile: string
  updatePoint: UpdatePoint
  updateState: UpdateState
  routePath: Array<Coords2> | null
  trafficRoutePath: Array<Coords2> | null
  routingGraphVisible: boolean
  polygonsVisible: boolean
  googleMapsOption: boolean
  trafficOption: boolean
  geography: Geography
  geographies: Array<Geography>
  recenter: boolean
  mapboxStyle: Array<MapboxStyle>
  authorization: string
  google?: any
  googleRoute: Route | null
}

export default class Map extends Component<Props, State> {
  static defaultProps = {
    mapboxStyle: [
      {
        type: 'dark',
        endpoint: 'mapbox://styles/mapbox/dark-v9'
      },
      {
        type: 'light',
        endpoint: 'mapbox://styles/mapbox/light-v9'
      }
    ]
  }

  mapContainer: any
  authorization: any

  constructor(props: Props) {
    super(props)
    this.state = {
      ...(process.env.NODE_ENV === 'test' && { map: new mapboxgl.Map() }),
      markers: [],
      style: 'light'
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      locations,
      profile,
      routePath,
      trafficRoutePath,
      routingGraphVisible,
      updatePoint,
      authorization,
      googleMapsOption,
      trafficOption,
      polygonsVisible,
      geography,
      geographies,
      recenter,
      updateState,
      googleRoute
    } = this.props
    const { map, markers, style } = this.state

    if (map && prevProps.locations !== locations) {
      this.removeMarkers(markers)
      const newMarkers = locations.reduce(
        (accum: Array<mapboxgl.Marker>, location: Location, index: number) => {
          if (location.lng && location.lat) {
            return [...accum, this.addMarker(location, map, index, updatePoint)]
          } else return accum
        },
        []
      )
      this.setState({ markers: newMarkers })
    }

    if (map && prevState.markers !== markers) {
      const points = this.getMarkerCoords(markers)
      points.length >= 1 && this.fitBounds(points, map)

      if (prevState.markers.length >= 2 && markers.length === 1) {
        this.removeSourceLayer('route', map)
        updateState('response', defaultRouteResponse)
      }
    }

    if (map && routePath && prevProps.routePath !== routePath) {
      this.addPolyline(
        routePath,
        markers,
        map,
        routingGraphVisible,
        'routeDAS',
        POLYLINE_COLOR,
        6.0
      )
    }

    if (map && trafficRoutePath && prevProps.trafficRoutePath !== trafficRoutePath) {
      this.addPolyline(
        trafficRoutePath,
        markers,
        map,
        routingGraphVisible,
        'routeTrafficDAS',
        TRAFFIC_PARTY_POLYLINE,
        5.5
      )
    }

    if (
      map &&
      prevProps.googleRoute !== googleRoute &&
      googleRoute &&
      googleRoute.routePath
    ) {
      this.addPolyline(
        googleRoute.routePath,
        markers,
        map,
        false,
        'routeGOOGLE',
        THIRD_PARTY_POLYLINE,
        6.5
      )
    }

    if (map && prevProps.routingGraphVisible !== routingGraphVisible) {
      if (routingGraphVisible) {
        Promise.resolve(this.removeSourceLayer('speeds', map)).then(() =>
          this.addSpeedsLayer(map, 'speeds')
        )
      } else {
        this.removeSourceLayer('speeds', map)
      }
    }

    if (map && prevProps.polygonsVisible !== polygonsVisible) {
      geographies.forEach(geography => {
        if (polygonsVisible) {
          Promise.resolve(this.removeSourceLayer(geography.name, map)).then(() =>
            this.addGeojson(geography, map)
          )
        } else {
          this.removeSourceLayer(geography.name, map)
        }
      })
    }

    if (
      map &&
      (prevProps.geography !== geography || (recenter && prevProps.recenter !== recenter))
    ) {
      const center = new mapboxgl.LngLat(geography.coords[0], geography.coords[1])
      this.flyTo(center, map, 1)
      recenter && updateState('recenter', false)
    }

    if (prevProps.authorization !== authorization && authorization) {
      this.authorization = authorization
    }

    if (map && prevProps.googleMapsOption !== googleMapsOption && !googleMapsOption) {
      this.removeSourceLayer('routeGOOGLE', map)
    }

    if (
      map &&
      ((prevProps.trafficOption !== trafficOption && !trafficOption) ||
        (prevProps.profile !== profile && profile === 'foot'))
    ) {
      this.removeSourceLayer('routeTrafficDAS', map)
    }
  }

  componentDidMount() {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

    const { mapboxStyle, updateState } = this.props
    const { style } = this.state
    const styleOption = mapboxStyle.find(el => el.type === style)
    this.loadMap(styleOption ? styleOption : mapboxStyle[0], updateState)
  }

  componentWillUnmount() {
    const { map } = this.state
    map && map.remove()
  }

  private loadMap = (mapboxStyle: MapboxStyle, updateState: UpdateState) => {
    const mapContainer = this.mapContainer

    const map: mapboxgl.Map = new mapboxgl.Map({
      container: mapContainer,
      style: mapboxStyle.endpoint,
      hash: true,
      maxZoom: 24.999,
      minZoom: 1,
      zoom: 4,
      center: [13.4147, 52.502],
      ...(process.env.NODE_ENV !== 'production' && {
        transformRequest: (url: any, resourceType: any): any => {
          if (url.includes('routing')) {
            return {
              url,
              method: 'GET',
              headers: {
                Authorization: this.authorization,
                'Content-Type': 'application/x-protobuf'
              }
            }
          }
        }
      })
    })

    map.on('load', () => {
      this.setState({ map })
      updateState('mapLoaded', true)
    })

    map.on('style.load', () =>
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    )

    map.on('click', event => this.handleMapClick(event))
  }

  private addGeojson = (geography: Geography, map: mapboxgl.Map) => {
    map.addLayer({
      id: geography.name,
      type: 'fill',
      source: {
        type: 'geojson',
        data: require(`../utils/assets/geojson/${geography.polygon}`)
      },
      layout: {},
      paint: {
        'fill-color': '#088',
        'fill-opacity': 0.2
      }
    })
  }

  private handleMapClick = (event: any) => {
    const { updatePoint, locations } = this.props

    const coords = {
      lat: event.lngLat.lat,
      lng: event.lngLat.lng
    }

    if (!locations[0].lat || !locations[0].lng) {
      updatePoint([0], [coords])
    } else {
      updatePoint([locations.length - 1], [coords])
    }
  }

  private addMarker = (
    location: Location,
    map: mapboxgl.Map,
    index: number,
    updatePoint: UpdatePoint
  ) => {
    const el = document.createElement('i')
    el.className = `${location.marker} icon custom-marker`

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
      offset:
        location.markerOffset &&
        new mapboxgl.Point(location.markerOffset[0], location.markerOffset[1]),
      draggable: true
    })
      .setLngLat([location.lng ? location.lng : 0, location.lat ? location.lat : 0])
      .addTo(map)

    marker &&
      marker.on('dragend', () => {
        const coords = marker.getLngLat()
        updatePoint([index], [{ lat: coords.lat, lng: coords.lng }])
      })

    return marker
  }

  private removeMarkers = (markers: Array<mapboxgl.Marker>) => {
    markers.forEach(marker => marker && marker.remove())
    this.setState({ markers: [] })
  }

  private getMarkerCoords = (markers: Array<mapboxgl.Marker>): number[][] => {
    return markers.map((marker: mapboxgl.Marker) => {
      const coords = marker && marker.getLngLat()
      return coords ? [coords.lng, coords.lat] : []
    })
  }

  private flyTo = (center: mapboxgl.LngLat, map: mapboxgl.Map, speed: number) => {
    map.flyTo({ center, speed })
  }

  private fitBounds = (coords: number[][], map: mapboxgl.Map) => {
    let bounds = new mapboxgl.LngLatBounds()

    if (coords.length === 1) {
      const center = new mapboxgl.LngLat(coords[0][0], coords[0][1])
      this.flyTo(center, map, 0.4)
      return
    }

    coords.forEach(coord => {
      const point = new mapboxgl.LngLat(coord[0], coord[1])
      bounds.extend(point)
    })

    map.fitBounds(bounds, {
      padding: {
        top: 350,
        left: 500,
        right: 200,
        bottom: 120
      },
      linear: true,
      easing: (time: number) => time
    })
  }

  private addSpeedsLayer = (
    map: mapboxgl.Map,
    source: null | string = null,
    datasourceFilter: null | Array<string> = null
  ) => {
    const speedsEntries = source
      ? speedTilesInput.filter(entry => entry.id === source)
      : speedTilesInput
    const sourceNames = speedsEntries
      .map(input => {
        const sourceName = input.id

        map.addSource(input.id, {
          type: 'vector',
          tiles: [input.url],
          minzoom: 11,
          maxzoom: 18
        })

        getSpeedsLayers(sourceName, datasourceFilter).forEach(layer => {
          map.addLayer(layer)
        })

        return input.id
      })
      .filter(item => item)

    return sourceNames
  }

  private removeSourceLayer = (sourceName: string, map: mapboxgl.Map) => {
    const styles = map.getStyle()

    Promise.resolve(
      styles &&
        styles.layers &&
        styles.layers
          .filter(layer => layer.id.includes(sourceName))
          .forEach(layer => {
            map.removeLayer(layer.id)
          })
    ).then(() => {
      map.getSource(sourceName) && map.removeSource(sourceName)
      return sourceName
    })
  }

  private addPolyline = (
    routePath: Array<Coords2>,
    markers: Array<mapboxgl.Marker>,
    map: mapboxgl.Map,
    routingGraphVisible: boolean,
    id: string,
    color: string,
    width: number
  ) => {
    const routeCoords = transformPoints(routePath)
    const points = this.getMarkerCoords(markers)
    const type = {
      id,
      color,
      width
    }
    this.addRoute(routeCoords, map, routingGraphVisible, type)
    this.fitBounds([...points, ...routeCoords], map)
  }

  private addRoute = (
    routePath: number[][],
    map: mapboxgl.Map,
    routingGraphVisible: boolean,
    type: { color: string; id: string, width: number }
  ) => {
    Promise.resolve(this.removeSourceLayer(type.id, map))
      .then(sourceName => {
        return map.addSource(type.id, {
          type: 'geojson',
          data: {
            ...(emptyLineString as any),
            features: [
              {
                ...emptyLineString.features[0],
                geometry: {
                  ...emptyLineString.features[0].geometry,
                  coordinates: routePath
                }
              }
            ]
          }
        })
      })
      .then(() => {
        map.addLayer({
          ...(routeLineSettings as any),
          id: `${type.id}-polyline`,
          source: type.id,
          paint: {
            ...routeLineSettings.paint,
            'line-color': routingGraphVisible ? 'black' : type.color,
            'line-width': type.width
          }
        })
      })
  }

  public render() {
    return <MapWrapper ref={el => (this.mapContainer = el)} />
  }
}
