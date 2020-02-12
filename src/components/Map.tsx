import throttle from 'lodash/throttle'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { Component } from 'react'
import styled from 'styled-components'
import turf from 'turf'
import {
  Coords2,
  GeographiesHandler,
  Geography,
  LocationInfo,
  MapboxStyle,
  OptionsHandler,
  Route,
  RouteProperty,
  Routes,
  UpdatePoint,
  UpdateState
} from '../types'
import {
  END_MARKER,
  ROUTING_SERVICE_POLYLINE,
  START_MARKER,
  THIRD_PARTY_POLYLINE,
  TRAFFIC_POLYLINE,
  WAYPOINT_MARKER
} from '../utils/colours'
import {
  addWaypoint,
  checkNested,
  getSpeedsLayers,
  reorderWaypoints,
  sortWaypoints,
  transformPoints
} from '../utils/functions'
import {
  defaultRoute,
  destinationTemplate,
  emptyLineString,
  routeLineSettings,
  speedTilesInput
} from '../utils/input'

const MapWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

interface State {
  map?: mapboxgl.Map
  markers: MarkerObject[]
  addedRoutesMarkers: MarkerObject[]
  polylineMarkers: MarkerObject[]
  addedRoutesIds: string[]
  style: string
  lineId: string
  legPath: number[][]
  locationIndex: number
  mouseDown: boolean
  mouseOnMarker: boolean
  listeners: Listeners
  [key: string]:
    | string
    | mapboxgl.Map
    | HTMLElement
    | MarkerObject[]
    | string[]
    | undefined
    | number[][]
    | number
    | boolean
    | Listeners
}

interface Props {
  locations: LocationInfo[]
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
  mapboxStyle: MapboxStyle[]
  authorization: string
  google?: any
  endpointHandler: OptionsHandler
  debug: boolean
  routeProperties: RouteProperty[]
  addedRoutes: Route[]
  routeHighlight: string
}

interface MarkerObject {
  id: string
  marker: mapboxgl.Marker
}

interface Listeners {
  [key: string]: any
}

export default class Map extends Component<Props, State> {
  public static defaultProps = {
    mapboxStyle: [
      {
        endpoint: 'mapbox://styles/mapbox/dark-v9',
        type: 'dark'
      },
      {
        endpoint: 'mapbox://styles/mapbox/light-v9',
        type: 'light'
      }
    ],
    routeProperties: [
      {
        color: ROUTING_SERVICE_POLYLINE,
        id: 'routeDAS',
        routeId: 'route',
        routingGraphVisible: true,
        width: 6.0
      },
      {
        color: TRAFFIC_POLYLINE,
        id: 'routeTrafficDAS',
        routeId: 'trafficRoute',
        routingGraphVisible: true,
        width: 5.5
      },
      {
        color: THIRD_PARTY_POLYLINE,
        id: 'routeGOOGLE',
        routeId: 'googleRoute',
        routingGraphVisible: false,
        width: 6.5
      }
    ]
  }

  public mapContainer: any
  public authorization: any

  constructor(props: Props) {
    super(props)
    this.state = {
      ...(process.env.NODE_ENV === 'test' && { map: new mapboxgl.Map() }),
      addedRoutesIds: [],
      addedRoutesMarkers: [],
      markers: [],
      polylineMarkers: [],
      style: 'light',
      lineId: '',
      legPath: [],
      locationIndex: 0,
      mouseDown: false,
      mouseOnMarker: false,
      listeners: {}
    }
    // this.drawPolylineEventMarker = throttle(this.drawPolylineEventMarker, 50)
    this.removeSourceLayer = throttle(this.removeSourceLayer, 50)
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
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

    if (map && prevProps.routes.route.routePath !== routes.route.routePath) {
      const routeName = 'routeDAS'
      if (routes.route.routePath.some(leg => leg.length > 1)) {
        this.addRoute(
          routes.route.routePath,
          markers,
          map,
          routingGraphVisible,
          routeName,
          ROUTING_SERVICE_POLYLINE,
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
      if (routes.trafficRoute.routePath.some(leg => leg.length > 1)) {
        this.addRoute(
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

    if (map && prevProps.routes.googleRoute.routePath !== routes.googleRoute.routePath) {
      const routeName = 'routeGOOGLE'
      if (routes.googleRoute.routePath.some(leg => leg.length > 1)) {
        this.addRoute(
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
      geographies.options.forEach((geo: Geography) => {
        if (polygonsVisible) {
          Promise.resolve(this.removeSourceLayer(geo.text, map)).then(() =>
            this.addGeojson(geo, map)
          )
        } else {
          this.removeSourceLayer(geo.text, map)
        }
      })
    }

    if (
      map &&
      (prevProps.geographies.activeIdx !== geographies.activeIdx ||
        (recenter && prevProps.recenter !== recenter))
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
      const routesArray = Object.keys(routes).map(routeKey => routes[routeKey])
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
      const routesArray = Object.keys(routes).map(routeKey => routes[routeKey])
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
            this.addRoute(
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
      if (routeHighlight === '') {
        map.setPaintProperty(`${prevProps.routeHighlight}-polyline`, 'line-width', 6.0)
      } else {
        map.setPaintProperty(`${routeHighlight}-polyline`, 'line-width', 10)
      }
    }
  }

  public componentDidMount() {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

    const { mapboxStyle, updateState } = this.props
    const { style } = this.state
    const styleOption = mapboxStyle.find(el => el.type === style)
    this.loadMap(styleOption ? styleOption : mapboxStyle[0], updateState)
  }

  public componentWillUnmount() {
    const { map } = this.state
    map && map.remove()
  }

  public render() {
    return <MapWrapper ref={el => (this.mapContainer = el)} />
  }

  private loadMap = (mapboxStyle: MapboxStyle, updateState: UpdateState) => {
    const mapContainer = this.mapContainer

    const map: mapboxgl.Map = new mapboxgl.Map({
      center: [13.4147, 52.502],
      container: mapContainer,
      hash: true,
      maxZoom: 24.999,
      minZoom: 1,
      style: mapboxStyle.endpoint,
      transformRequest: (url: any): any => {
        if (url.includes('routing')) {
          return {
            headers: {
              Authorization: this.authorization,
              'Content-Type': 'application/x-protobuf'
            },
            method: 'GET',
            url
          }
        }
      },
      zoom: 4
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
    addedRoutes: Route[],
    addedRoutesIds: string[],
    addedRoutesMarkers: MarkerObject[],
    map: mapboxgl.Map,
    routingGraphVisible: boolean,
    updatePoint: UpdatePoint
  ) => {
    let newAddedRoutesMarkers: MarkerObject[] = [...addedRoutesMarkers]

    const newAddedRoutesIds = addedRoutes.reduce((accum: string[], routeKey: Route) => {
      if (!addedRoutesIds.includes(routeKey.id)) {
        this.addRoute(
          routeKey.routePath,
          [],
          map,
          routingGraphVisible,
          routeKey.id,
          checkNested(routeKey, 'parsedValue', 'provider', 'name') &&
            routeKey.parsedValue.provider.name === 'Google'
            ? THIRD_PARTY_POLYLINE
            : ROUTING_SERVICE_POLYLINE,
          6.0
        )

        const totalRoutePath = routeKey.routePath.map(leg => transformPoints(leg)).flat()

        if (totalRoutePath.length >= 2) {
          const startLocation = {
            lat: totalRoutePath[0][1],
            lon: totalRoutePath[0][0],
            marker: 'map marker alternate',
            markerColor: START_MARKER,
            markerOffset: [0, 5],
            name: 'start',
            placeholder: 'Origin'
          }
          const endLocation = {
            lat: totalRoutePath.slice(-1)[0][1],
            lon: totalRoutePath.slice(-1)[0][0],
            marker: 'map marker',
            markerColor: END_MARKER,
            markerOffset: [0, 5],
            name: 'end',
            placeholder: 'Destination'
          }

          newAddedRoutesMarkers = [
            ...newAddedRoutesMarkers,
            this.addMarker(startLocation, map, 0, updatePoint, false, routeKey.id),
            this.addMarker(endLocation, map, 0, updatePoint, false, routeKey.id)
          ]
        }
      }
      return [...accum, routeKey.id]
    }, [])

    const bounds = this.createBounds(newAddedRoutesMarkers, '', addedRoutes)
    this.fitBounds(bounds, map)

    this.setState({
      addedRoutesIds: newAddedRoutesIds,
      addedRoutesMarkers: newAddedRoutesMarkers
    })
  }

  private removeAddedRoutes = (
    addedRoutesIds: string[],
    addedRoutes: Route[],
    map: mapboxgl.Map,
    addedRoutesMarkers: MarkerObject[]
  ) => {
    let markerIds: string[] = []
    const presentIds = addedRoutes.map(route => route.id)
    const newAddedRoutesIds = addedRoutesIds.reduce(
      (accum: string[], routeId: string) => {
        if (!presentIds.includes(routeId)) {
          this.removeSourceLayer(routeId, map)
          markerIds = [...markerIds, routeId]
          return accum
        } else {
          return [...accum, routeId]
        }
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
        const { addedRoutesMarkers: newAddedRoutesMarkers } = this.state
        const bounds = this.createBounds(newAddedRoutesMarkers, '', addedRoutes)
        this.fitBounds(bounds, map)
      }
    )
  }

  private addGeojson = (geography: Geography, map: mapboxgl.Map) => {
    map.addLayer({
      id: geography.text,
      layout: {},
      paint: {
        'fill-color': '#088',
        'fill-opacity': 0.2
      },
      source: {
        data: require(`../utils/assets/geojson/${geography.polygon}`),
        type: 'geojson'
      },
      type: 'fill'
    })
  }

  private handleMapClick = (event: any) => {
    const { updatePoint, locations, debug, updateState } = this.props

    if (debug) {
      return
    }

    const coords = {
      lat: event.lngLat.lat,
      lon: event.lngLat.lng
    }

    if (!locations[0].lat || !locations[0].lon) {
      updatePoint([0], [coords])
    } else if (!locations[1].lat || !locations[1].lon) {
      updatePoint([1], [coords])
    } else {
      if (!locations.slice(-1)[0].lat) {
        updatePoint([locations.length - 1], [coords])
      } else {
        const newLocations = addWaypoint(locations)
        updateState(
          'locations',
          newLocations.map((location, index) => {
            if (!newLocations[index + 1]) {
              return {
                ...location,
                lat: coords.lat,
                lon: coords.lon
              }
            } else {
              return location
            }
          })
        )
      }
    }
  }

  private addLocationMarkers = (
    locations: LocationInfo[],
    map: mapboxgl.Map,
    updatePoint: UpdatePoint,
    id: string
  ) => {
    return locations.reduce(
      (accum: MarkerObject[], location: LocationInfo, index: number) => {
        if (location.lon && location.lat) {
          return [...accum, this.addMarker(location, map, index, updatePoint, true, id)]
        } else {
          return accum
        }
      },
      []
    )
  }

  private addMarker = (
    location: LocationInfo,
    map: mapboxgl.Map,
    index: number | null,
    updatePoint: UpdatePoint | null,
    draggable: boolean,
    id: string
  ) => {
    const el = document.createElement('i')
    el.className = `${location.marker} icon custom-marker ${location.name}`

    const marker = new mapboxgl.Marker({
      anchor: 'bottom',
      draggable,
      element: el,
      offset:
        location.markerOffset &&
        new mapboxgl.Point(location.markerOffset[0], location.markerOffset[1])
    })
      .setLngLat([location.lon ? location.lon : 0, location.lat ? location.lat : 0])
      .addTo(map)

    marker &&
      draggable &&
      el.addEventListener('mouseenter', () => {
        this.setState({ mouseOnMarker: true })
      })

    marker &&
      draggable &&
      el.addEventListener('mouseleave', () => {
        this.setState({ mouseOnMarker: false })
      })

    marker &&
      draggable &&
      updatePoint &&
      index !== null &&
      marker.on('dragend', () => {
        const coords = marker.getLngLat()
        updatePoint([index], [{ lat: coords.lat, lon: coords.lng }])
      })

    return {
      id,
      marker
    }
  }

  private removeMarkers = (markers: MarkerObject[], markersName: string) => {
    const markerIdsSet: Set<string> = new Set(markers.map(el => el.id))
    const markerIds: string[] = Array.from(markerIdsSet)

    this.setState((prevState: any) => ({
      ...prevState,
      [markersName]: prevState[markersName]
        ? prevState[markersName].reduce((accum: MarkerObject[], marker: MarkerObject) => {
            if (markerIds.includes(marker.id)) {
              marker.marker && marker.marker.remove && marker.marker.remove()
              return accum
            } else {
              return [...accum, marker]
            }
          }, [])
        : []
    }))
  }

  private getMarkerCoords = (markers: MarkerObject[]): number[][] => {
    return markers
      .map((marker: MarkerObject) => {
        const coords =
          marker.marker && marker.marker.getLngLat && marker.marker.getLngLat()
        return coords ? [coords.lng, coords.lat] : []
      })
      .filter(el => el.length > 0)
  }

  private flyTo = (center: mapboxgl.LngLat, map: mapboxgl.Map, speed: number) => {
    map.flyTo({ center, speed })
  }

  private createBounds = (
    markers: MarkerObject[],
    exemptRoute: string,
    routes: Route[]
  ) => {
    const routeCoords = routes.reduce((accum: number[][], route: Route) => {
      if (route.id !== exemptRoute && route.routePath.length > 1) {
        return [...accum, ...route.routePath.map(leg => transformPoints(leg).flat())]
      } else {
        return [...accum]
      }
    }, [])

    const points = this.getMarkerCoords(markers)

    return [...points, ...routeCoords]
  }

  private fitBounds = (coords: number[][], map: mapboxgl.Map) => {
    const bounds = new mapboxgl.LngLatBounds()

    if (coords.length === 0) {
      return
    }

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
      easing: (time: number) => time,
      linear: true,
      padding: {
        bottom: 120,
        left: 550,
        right: 300,
        top: 350
      }
    })
  }

  private addSpeedsLayer = (
    map: mapboxgl.Map,
    source: null | string = null,
    profile: string,
    endpointUrlString: string,
    datasourceFilter: null | string[] = null
  ) => {
    const speedsEntries = source
      ? speedTilesInput.filter(entry => entry.id === source)
      : speedTilesInput
    return speedsEntries
      .map(input => {
        const sourceName = input.id
        const profileStr = profile === 'driving' ? 'car' : profile

        const url = `${endpointUrlString}/tile/v1/${profileStr}/tile({x},{y},{z}).mvt`

        map.addSource(input.id, {
          maxzoom: 18,
          minzoom: 11,
          tiles: [url],
          type: 'vector'
        })

        getSpeedsLayers(sourceName, datasourceFilter).forEach(layer => {
          map.addLayer(layer)
        })

        return input.id
      })
      .filter(item => item)
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
      styles &&
        styles.sources &&
        Object.keys(styles.sources)
          .filter(source => source.includes(sourceName))
          .forEach(source => {
            map.removeSource(source)
          })
      return sourceName
    })
  }

  private addRoute = async (
    routePath: Coords2[][],
    markers: MarkerObject[],
    map: mapboxgl.Map,
    routingGraphVisible: boolean,
    id: string,
    color: string,
    width: number
  ) => {
    const points = this.getMarkerCoords(markers)

    const { listeners } = this.state

    await Object.keys(listeners).forEach(lineId => {
      Object.keys(listeners[lineId]).forEach((listener: string) => {
        map.off(
          // @ts-ignore
          listener.toLowerCase().replace('on', ''),
          lineId,
          listeners[lineId][listener]
        )
      })
    })

    await this.setState({ listeners: {} })

    Promise.resolve(this.removeSourceLayer(id, map)).then(() => {
      const routeCoords = routePath.map((leg, i) => {
        const type = {
          color,
          id,
          secondaryId: `${id}-${i}`,
          width
        }

        const legCoords = transformPoints(leg)
        this.addPolyline(legCoords, map, routingGraphVisible, type)
        return legCoords
      })
      this.fitBounds([...points, ...routeCoords.flat()], map)
    })
  }

  private addPolyline = (
    legPath: number[][],
    map: mapboxgl.Map,
    routingGraphVisible: boolean,
    type: { color: string; id: string; secondaryId: string; width: number }
  ) => {
    Promise.resolve(
      map.addSource(type.secondaryId, {
        data: {
          ...(emptyLineString as any),
          features: [
            {
              ...emptyLineString.features[0],
              geometry: {
                ...emptyLineString.features[0].geometry,
                coordinates: legPath
              }
            }
          ]
        },
        type: 'geojson'
      })
    ).then(() => {
      const lineId = `${type.secondaryId}-polyline`

      map.addLayer({
        ...(routeLineSettings as any),
        id: lineId,
        paint: {
          ...routeLineSettings.paint,
          'line-color': type.color,
          'line-opacity': routingGraphVisible
            ? 0.85
            : routeLineSettings.paint['line-opacity'],
          'line-width': routingGraphVisible ? 2 * type.width : type.width
        },
        source: type.secondaryId
      })

      const canvas = map.getCanvasContainer()
      const locationIndex = Number(lineId.split('-')[1])

      const onMouseEnter = (e: any) => {
        if (this.state.mouseOnMarker) {
          return
        }

        canvas.style.cursor = 'none'

        map.on('mousemove', onMouseMove)
        map.on('mousedown', onMouseDown)
      }

      const onMouseMove = (e: any) => {
        const coords = {
          lat: e.lngLat.lat,
          lon: e.lngLat.lng
        }

        const { mouseOnMarker, mouseDown, listeners } = this.state

        if (mouseOnMarker) {
          onMouseLeave()
        } else if (mouseDown) {
          this.drawPolylineEventMarker(map, legPath, coords, false)
        } else {
          const features = map.queryRenderedFeatures(
            [[e.point.x - 10, e.point.y - 10], [e.point.x + 10, e.point.y + 10]],
            {
              layers: Object.keys(listeners)
            }
          )

          if (features.length >= 1) {
            if (features[0].layer.id === lineId) {
              this.drawPolylineEventMarker(map, legPath, coords, true)
            }
          } else {
            onMouseLeave()
          }
        }
      }

      const onMouseLeave = () => {
        canvas.style.cursor = 'grab'
        this.removeMarkers(this.state.polylineMarkers, 'polylineMarkers')
        map.off('mousemove', onMouseMove)
        map.off('mousedown', onMouseDown)
        map.off('mouseup', onMouseUp)
      }

      const onMouseDown = (e: any) => {
        e.preventDefault()

        this.setState({ mouseDown: true })

        const features = map.queryRenderedFeatures(
          [[e.point.x - 10, e.point.y - 10], [e.point.x + 10, e.point.y + 10]],
          {
            layers: Object.keys(this.state.listeners)
          }
        )

        if (features.length >= 1 && features[0].layer.id !== lineId) {
          map.off('mouseenter', lineId, onMouseEnter)
          map.off('mousemove', onMouseMove)
          map.off('mousedown', onMouseDown)
          map.off('mouseup', onMouseUp)
        } else {
          map.once('mouseup', onMouseUp)
        }
      }

      const onMouseUp = (e: any) => {
        this.setState({ mouseDown: false })

        const { locations, updateState } = this.props

        const coords = e.lngLat

        const newLocations = [
          ...locations,
          {
            ...destinationTemplate,
            lat: coords.lat,
            lon: coords.lng
          }
        ]

        updateState(
          'locations',
          sortWaypoints(
            reorderWaypoints(newLocations, newLocations.length - 1, locationIndex + 1)
          )
        )
        onMouseLeave()
        map.off('mousedown', onMouseDown)
        map.off('mouseup', onMouseUp)
      }

      map.on('mouseenter', lineId, onMouseEnter)

      this.setState(prevState => ({
        listeners: {
          ...prevState.listeners,
          [lineId]: {
            onMouseDown,
            onMouseEnter,
            onMouseMove,
            onMouseUp
          }
        }
      }))
    })
  }

  private drawPolylineEventMarker = (
    map: mapboxgl.Map,
    legPath: number[][],
    coords: Coords2,
    inLine: boolean
  ) => {
    this.removeMarkers(this.state.polylineMarkers, 'polylineMarkers')

    let location
    if (inLine) {
      const nearestPoint = turf.pointOnLine(
        turf.lineString(legPath),
        turf.point([coords.lon, coords.lat])
      )

      location = {
        name: 'polyline-circle',
        marker: '',
        markerColor: 'circle',
        markerOffset: [0, 8],
        placeholder: 'Circle',
        lat: nearestPoint.geometry.coordinates[1],
        lon: nearestPoint.geometry.coordinates[0]
      }
    } else {
      location = {
        name: 'polyline-circle',
        marker: '',
        markerColor: 'circle',
        markerOffset: [0, 8],
        placeholder: 'Circle',
        lat: coords.lat,
        lon: coords.lon
      }
    }

    this.setState({
      polylineMarkers: [this.addMarker(location, map, null, null, false, location.name)]
    })
  }
}
