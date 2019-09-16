import React, { Component } from 'react'
import mapboxgl, { Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import styled from 'styled-components'
import {
  UpdatePoint,
  UpdateState,
  Location,
  Coords2,
  Geography,
  Option,
  MapboxStyle,
  OptionsHandler,
  RouteProperty,
  Routes,
  Route,
  GeographiesHandler
} from '../types'
import {
  routeLineSettings,
  emptyLineString,
  speedTilesInput,
  defaultRoute
} from '../utils/input'
import { transformPoints, getSpeedsLayers, checkNested } from '../utils/functions'
import { POLYLINE_COLOR, THIRD_PARTY_POLYLINE, TRAFFIC_POLYLINE } from '../utils/colours'
import route from '../utils/schemas/route'

const MapWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

interface State {
  map?: mapboxgl.Map
  markers: Array<MarkerObject>
  addedRoutesMarkers: Array<MarkerObject>
  addedRoutesIds: string[]
  style: string
  [key: string]: string | mapboxgl.Map | Array<MarkerObject> | string[] | undefined
}

interface Props {
  locations: Array<Location>
  profile: string
  updatePoint: UpdatePoint
  updateState: UpdateState
  routes: Routes
  routingGraphVisible: boolean
  polygonsVisible: boolean
  googleMapsOption: boolean
  trafficOption: boolean
  geographies: GeographiesHandler
  recenter: boolean
  mapboxStyle: Array<MapboxStyle>
  authorization: string
  google?: any
  endpointHandler: OptionsHandler
  debug: boolean
  routeProperties: Array<RouteProperty>
  addedRoutes: Array<Route>
  routeHighlight: string
}

type MarkerObject = {
  id: string
  marker: mapboxgl.Marker
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
    ],
    routeProperties: [
      {
        id: 'routeDAS',
        color: POLYLINE_COLOR,
        routeId: 'route',
        width: 6.0,
        routingGraphVisible: true
      },
      {
        id: 'routeTrafficDAS',
        color: TRAFFIC_POLYLINE,
        routeId: 'trafficRoute',
        width: 5.5,
        routingGraphVisible: true
      },
      {
        id: 'routeGOOGLE',
        color: THIRD_PARTY_POLYLINE,
        routeId: 'googleRoute',
        width: 6.5,
        routingGraphVisible: false
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
      addedRoutesMarkers: [],
      style: 'light',
      addedRoutesIds: []
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      locations,
      profile,
      routes,
      routingGraphVisible,
      updatePoint,
      authorization,
      googleMapsOption,
      trafficOption,
      polygonsVisible,
      geographies,
      recenter,
      updateState,
      endpointHandler,
      debug,
      routeProperties,
      addedRoutes,
      routeHighlight
    } = this.props
    const { map, markers, addedRoutesIds, addedRoutesMarkers } = this.state
    const geography = geographies.options[geographies.activeIdx]

    if (map && prevProps.locations !== locations) {
      this.removeMarkers(markers, 'markers')
      this.setState({
        markers: this.addLocationMarkers(locations, map, updatePoint, 'route')
      })
    }

    if (map && prevState.markers !== markers) {
      const points = this.getMarkerCoords(markers)
      points.length >= 1 && this.fitBounds(points, map)

      if (prevState.markers.length >= 2 && markers.length === 1) {
        this.removeSourceLayer('route', map)
        updateState('routes', {
          googleRoute: defaultRoute,
          route: defaultRoute,
          trafficRoute: defaultRoute
        })
      }
    }

    if (
      map &&
      prevProps.routes.route.routePath !== routes.route.routePath
    ) {
      const routeName = 'routeDAS'
      if (routes.route.routePath.length > 1) {
        this.addPolyline(
          routes.route.routePath,
          markers,
          map,
          routingGraphVisible,
          routeName,
          POLYLINE_COLOR,
          6.0
        )
      } else {
        this.removeSourceLayer(routeName, map)
      }
    }

    if (
      map &&
      prevProps.routes.trafficRoute.routePath !== routes.trafficRoute.routePath
    ) {
      const routeName = 'routeTrafficDAS'
      if (routes.trafficRoute.routePath.length > 1) {
        this.addPolyline(
          routes.trafficRoute.routePath,
          markers,
          map,
          routingGraphVisible,
          routeName,
          TRAFFIC_POLYLINE,
          5.5
        )
      } else {
        this.removeSourceLayer(routeName, map)
      }
    }

    if (
      map &&
      prevProps.routes.googleRoute.routePath !== routes.googleRoute.routePath
    ) {
      const routeName = 'routeGOOGLE'
      if (routes.googleRoute.routePath.length > 1) {
        this.addPolyline(
          routes.googleRoute.routePath,
          markers,
          map,
          routingGraphVisible,
          routeName,
          THIRD_PARTY_POLYLINE,
          6.5
        )
      } else {
        this.removeSourceLayer(routeName, map)
      }
    }

    // get new tiles if the endpoint, the traffic option or profile changed
    if (
      map &&
      ((prevProps.endpointHandler.activeIdx !== endpointHandler.activeIdx &&
        routingGraphVisible) ||
        (prevProps.trafficOption !== trafficOption && routingGraphVisible) ||
        (prevProps.profile !== profile && routingGraphVisible) ||
        prevProps.routingGraphVisible !== routingGraphVisible)
    ) {
      const tileProfile = trafficOption ? profile + '-traffic' : profile

      if (routingGraphVisible) {
        Promise.resolve(this.removeSourceLayer('speeds', map)).then(() => {
          return this.addSpeedsLayer(
            map,
            'speeds',
            tileProfile,
            endpointHandler.options[endpointHandler.activeIdx].text
          )
        })
      } else {
        this.removeSourceLayer('speeds', map)
      }
    }

    if (map && prevProps.polygonsVisible !== polygonsVisible) {
      geographies.options.forEach((geography: Geography) => {
        if (polygonsVisible) {
          Promise.resolve(this.removeSourceLayer(geography.text, map)).then(() =>
            this.addGeojson(geography, map)
          )
        } else {
          this.removeSourceLayer(geography.text, map)
        }
      })
    }

    if (
      map &&
      (prevProps.geographies.activeIdx !== geographies.activeIdx || (recenter && prevProps.recenter !== recenter))
    ) {
      const center = new mapboxgl.LngLat(geography.coords[0], geography.coords[1])
      this.flyTo(center, map, 1)
      recenter && updateState('recenter', false)
    }

    if (prevProps.authorization !== authorization && authorization) {
      this.authorization = authorization
    }

    if (map && prevProps.googleMapsOption !== googleMapsOption && !googleMapsOption) {
      const routeName = 'routeGOOGLE'

      this.removeSourceLayer(routeName, map)
      const routesArray = Object.keys(routes).map(route => routes[route])
      const bounds = this.createBounds(markers, routeName, routesArray)
      this.fitBounds(bounds, map)
    }

    if (
      map &&
      ((prevProps.trafficOption !== trafficOption && !trafficOption) ||
        (prevProps.profile !== profile && profile === 'foot'))
    ) {
      const routeName = 'routeTrafficDAS'

      this.removeSourceLayer(routeName, map)
      const routesArray = Object.keys(routes).map(route => routes[route])
      const bounds = this.createBounds(markers, routeName, routesArray)
      this.fitBounds(bounds, map)
    }

    if (map && prevProps.debug !== debug) {
      if (debug) {
        this.removeMarkers(markers, 'markers')
        this.removeSourceLayer('route', map)

        this.addAddedRoutes(
          addedRoutes,
          [],
          addedRoutesMarkers,
          map,
          routingGraphVisible,
          updatePoint
        )
      } else {
        addedRoutesIds.forEach(routeId => this.removeSourceLayer(routeId, map))
        this.removeMarkers(addedRoutesMarkers, 'addedRoutesMarkers')
        this.setState({
          markers: this.addLocationMarkers(locations, map, updatePoint, 'route')
        })

        routeProperties.forEach(item => {
          const routePath = routes[item.routeId].routePath
          routePath.length > 1 &&
            this.addPolyline(
              routes[item.routeId].routePath,
              markers,
              map,
              routingGraphVisible,
              item.id,
              item.color,
              item.width
            )
        })
      }
    }

    if (map && prevProps.addedRoutes !== addedRoutes) {
      if (prevProps.addedRoutes.length < addedRoutes.length) {
        this.addAddedRoutes(
          addedRoutes,
          addedRoutesIds,
          addedRoutesMarkers,
          map,
          routingGraphVisible,
          updatePoint
        )
      } else if (prevProps.addedRoutes.length > addedRoutes.length) {
        this.removeAddedRoutes(addedRoutesIds, addedRoutes, map, addedRoutesMarkers)
      }
    }

    if (map && prevProps.routeHighlight !== routeHighlight) {
      if (routeHighlight === '')
        map.setPaintProperty(`${prevProps.routeHighlight}-polyline`, 'line-width', 6.0)
      else map.setPaintProperty(`${routeHighlight}-polyline`, 'line-width', 10)
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

    map.on('load', () => {
      this.setState({ map })
      updateState('mapLoaded', true)
    })

    map.on('style.load', () =>
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    )

    map.on('click', event => this.handleMapClick(event))
  }

  private addAddedRoutes = (
    addedRoutes: Array<Route>,
    addedRoutesIds: Array<string>,
    addedRoutesMarkers: Array<MarkerObject>,
    map: mapboxgl.Map,
    routingGraphVisible: boolean,
    updatePoint: UpdatePoint
  ) => {
    let newAddedRoutesMarkers: Array<MarkerObject> = [...addedRoutesMarkers]

    const newAddedRoutesIds = addedRoutes.reduce((accum: string[], route: Route) => {
      if (!addedRoutesIds.includes(route.id)) {
        this.addPolyline(
          route.routePath,
          [],
          map,
          routingGraphVisible,
          route.id,
          checkNested(route, 'parsedValue', 'provider', 'name') && route.parsedValue.provider.name === 'Google'
            ? THIRD_PARTY_POLYLINE
            : POLYLINE_COLOR,
          6.0
        )

        const startLocation = {
          name: 'start',
          marker: 'map marker alternate',
          markerOffset: [0, 5],
          placeholder: 'Origin',
          lat: route.routePath[0].lat,
          lng: route.routePath[0].lon
        }
        const endLocation = {
          name: 'end',
          marker: 'map marker',
          markerOffset: [0, 5],
          placeholder: 'Destination',
          lat: route.routePath.slice(-1)[0].lat,
          lng: route.routePath.slice(-1)[0].lon
        }

        newAddedRoutesMarkers = [
          ...newAddedRoutesMarkers,
          this.addMarker(startLocation, map, 0, updatePoint, false, route.id),
          this.addMarker(endLocation, map, 0, updatePoint, false, route.id)
        ]
      }
      return [...accum, route.id]
    }, [])

    const bounds = this.createBounds(newAddedRoutesMarkers, '', addedRoutes)
    this.fitBounds(bounds, map)

    this.setState({
      addedRoutesIds: newAddedRoutesIds,
      addedRoutesMarkers: newAddedRoutesMarkers
    })
  }

  private removeAddedRoutes = (
    addedRoutesIds: Array<string>,
    addedRoutes: Array<Route>,
    map: mapboxgl.Map,
    addedRoutesMarkers: Array<MarkerObject>
  ) => {
    let markerIds: Array<string> = []
    const presentIds = addedRoutes.map(route => route.id)
    const newAddedRoutesIds = addedRoutesIds.reduce(
      (accum: Array<string>, routeId: string) => {
        if (!presentIds.includes(routeId)) {
          this.removeSourceLayer(routeId, map)
          markerIds = [...markerIds, routeId]
          return accum
        } else return [...accum, routeId]
      },
      []
    )

    const markersToRemove = addedRoutesMarkers.filter(marker =>
      markerIds.includes(marker.id)
    )
    const markersToRemain = addedRoutesMarkers.filter(
      marker => !markerIds.includes(marker.id)
    )
    this.removeMarkers(markersToRemove, 'addedRoutesMarkers')

    this.setState(
      {
        addedRoutesIds: newAddedRoutesIds,
        addedRoutesMarkers: markersToRemain
      },
      () => {
        const { addedRoutesMarkers } = this.state
        const bounds = this.createBounds(addedRoutesMarkers, '', addedRoutes)
        this.fitBounds(bounds, map)
      }
    )
  }

  private addGeojson = (geography: Geography, map: mapboxgl.Map) => {
    map.addLayer({
      id: geography.text,
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
    const { updatePoint, locations, debug } = this.props

    if (debug) return

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

  private addLocationMarkers = (
    locations: Array<Location>,
    map: mapboxgl.Map,
    updatePoint: UpdatePoint,
    id: string
  ) => {
    return locations.reduce(
      (accum: Array<MarkerObject>, location: Location, index: number) => {
        if (location.lng && location.lat) {
          return [...accum, this.addMarker(location, map, index, updatePoint, true, id)]
        } else return accum
      },
      []
    )
  }

  private addMarker = (
    location: Location,
    map: mapboxgl.Map,
    index: number,
    updatePoint: UpdatePoint,
    draggable: boolean,
    id: string
  ) => {
    const el = document.createElement('i')
    el.className = `${location.marker} icon custom-marker`

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
      offset:
        location.markerOffset &&
        new mapboxgl.Point(location.markerOffset[0], location.markerOffset[1]),
      draggable
    })
      .setLngLat([location.lng ? location.lng : 0, location.lat ? location.lat : 0])
      .addTo(map)

    marker &&
      draggable &&
      marker.on('dragend', () => {
        const coords = marker.getLngLat()
        updatePoint([index], [{ lat: coords.lat, lng: coords.lng }])
      })

    return {
      marker,
      id
    }
  }

  private removeMarkers = (markers: Array<MarkerObject>, markersName: string) => {
    const markerIdsSet: Set<string> = new Set(markers.map(el => el.id))
    const markerIds: Array<string> = Array.from(markerIdsSet)

    this.setState((prevState: any) => ({
      ...prevState,
      [markersName]: prevState[markersName]
        ? prevState[markersName].reduce(
            (accum: Array<MarkerObject>, marker: MarkerObject) => {
              if (markerIds.includes(marker.id)) {
                marker.marker && marker.marker.remove && marker.marker.remove()
                return accum
              } else return [...accum, marker]
            },
            []
          )
        : []
    }))
  }

  private getMarkerCoords = (markers: Array<MarkerObject>): number[][] => {
    return markers.map((marker: MarkerObject) => {
      const coords = marker.marker && marker.marker.getLngLat && marker.marker.getLngLat()
      return coords ? [coords.lng, coords.lat] : []
    }).filter(el => el.length > 0)
  }

  private flyTo = (center: mapboxgl.LngLat, map: mapboxgl.Map, speed: number) => {
    map.flyTo({ center, speed })
  }

  private createBounds = (
    markers: Array<MarkerObject>,
    exemptRoute: string,
    routes: Array<Route>
  ) => {
    const routeCoords = routes.reduce((accum: number[][], route: Route) => {
      if (route.id !== exemptRoute && route.routePath.length > 1) {
        return [...accum, ...transformPoints(route.routePath)]
      } else return [...accum]
    }, [])

    const points = this.getMarkerCoords(markers)

    return [...points, ...routeCoords]
  }

  private fitBounds = (coords: number[][], map: mapboxgl.Map) => {
    let bounds = new mapboxgl.LngLatBounds()

    if (coords.length === 0) return

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
        left: 550,
        right: 250,
        bottom: 120
      },
      linear: true,
      easing: (time: number) => time
    })
  }

  private addSpeedsLayer = (
    map: mapboxgl.Map,
    source: null | string = null,
    profile: string,
    endpointUrlString: string,
    datasourceFilter: null | Array<string> = null
  ) => {
    const speedsEntries = source
      ? speedTilesInput.filter(entry => entry.id === source)
      : speedTilesInput
    const sourceNames = speedsEntries
      .map(input => {
        const sourceName = input.id

        endpointUrlString = endpointUrlString.replace('${PROFILE}', profile)
        const url = `${endpointUrlString}/v1/tile/{x},{y},{z}`

        map.addSource(input.id, {
          type: 'vector',
          tiles: [url],
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
    markers: Array<MarkerObject>,
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
    type: { color: string; id: string; width: number }
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
            'line-color': type.color,
            'line-width': routingGraphVisible ? 2 * type.width : type.width,
            'line-opacity': routingGraphVisible
              ? 0.85
              : routeLineSettings.paint['line-opacity']
          }
        })
      })
  }

  public render() {
    return <MapWrapper ref={el => (this.mapContainer = el)} />
  }
}
