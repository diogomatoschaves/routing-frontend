import { History, Location as BrowserLocation } from 'history'
import queryString from 'query-string'
import { generatePath } from 'react-router'
import { Coords, LocationInfo, OptionsHandler, ProfileItem, WaitTillLoaded } from '../types'
import { findDiff, formatCoords, splitCoords, stringToBoolean } from './functions'

interface Params {
  locations: string
  profile: string
  endpointHandler: string
  [key: string]: string
}

export interface OptionalParams {
  google?: boolean | string
  traffic?: boolean | string
  coveredAreas?: boolean | string
  routingGraph?: boolean | string
  debug?: boolean | string
  [key: string]: boolean | undefined | string
}

export const requiredParams: Params = {
  endpointHandler: 'endpointHandler',
  locations: 'locations',
  profile: 'profile'
}

export const optionalParamsMapping: OptionalParams = {
  coveredAreas: 'polygonsVisible',
  google: 'googleMapsOption',
  routingGraph: 'routingGraphVisible',
  traffic: 'trafficOption'
}

export const matchingParams = ['/:profile', '/:locations', '/:endpointHandler']
export const urlMatchString = matchingParams.join('')

export const getSettingsFromUrl = (
  queryParams: OptionalParams,
  locations: LocationInfo[],
  profile: string,
  params: Params,
  endpoints: OptionsHandler,
  profiles: ProfileItem[],
  loadedProp: boolean,
  history: History,
  location: BrowserLocation,
  waitTillLoaded: WaitTillLoaded
) => {
  return new Promise(resolve => {
    const mappedProfiles = profiles.map((item: ProfileItem) => item.name)
    const endpointsArray = endpoints.options.map(el => el.key)

    if (checkUrlValidity(params, mappedProfiles, endpointsArray)) {
      waitTillLoaded(loadedProp).then(() => {
        const extractedParams = extractUrlParams(locations, params, endpoints)
        resolve(extractedParams)
      })
    } else {
      resolve()
    }
  }).then(extractedParams => {
    const mappedQueryParams = mapOptionalParameters(
      optionalParamsMapping,
      queryParams,
      true
    )

    return Promise.resolve({
      ...extractedParams,
      ...mappedQueryParams
    })
  })
}

export const checkUrlValidity = (
  params: Params,
  acceptableProfiles: string[],
  endpoints: string[]
) => {
  const paramsKeys = Object.keys(params)
  return (
    paramsKeys.length >= 1 &&
    paramsKeys.some((el: string) => {
      if (el === requiredParams.locations) {
        const coords = params[requiredParams.locations]
          .split(';')
          .map(item => splitCoords(item) || { lat: null, lon: null })
        return coords.every(coord => coord.lat && coord.lon)
      } else if (el === requiredParams.profile) {
        return acceptableProfiles.includes(params[el])
      } else if (el === requiredParams.endpointHandler) {
        return endpoints.includes(params[el])
      }
    })
  )
}

export const getPath = (pathname: string) => {
  const splitUrl = pathname.split('/')

  let usedIndex = -1

  return splitUrl.length > matchingParams.length + 1
    ? ''
    : splitUrl.reduce((accum: string, item: string) => {
        if (item) {
          usedIndex++
          return accum + matchingParams[usedIndex]
        } else {
          return accum
        }
      }, '')
}

export const generateFullPath = (
  locations: LocationInfo[],
  profile: string,
  endpointHandler: string,
  queryParams: OptionalParams
) => {
  const urlParamsString = generatePath(urlMatchString, {
    endpointHandler,
    locations: locations
      .map(location => {
        return location.lat && location.lon
          ? formatCoords({ lat: location.lat, lon: location.lon })
          : '-'
      })
      .join(';'),
    profile
  })

  const queryParamsString = Object.entries(queryParams)
    .reduce((str: string, param: any) => {
      return `${str}${param[0]}=${String(param[1])}&`
    }, '?')
    .slice(0, -1)

  return urlParamsString + queryParamsString
}

export const extractUrlParams = (
  locations: LocationInfo[],
  params: Params,
  endpoints: OptionsHandler
) => {
  const validLocation =
    params[requiredParams.locations] &&
    params[requiredParams.locations].split(';').length >= 2

  const coords =
    validLocation &&
    params[requiredParams.locations]
      .split(';')
      .map(item => splitCoords(item) || { lat: null, lon: null })

  const endpointIdx = endpoints.options.findIndex(
    el => el.key === params[requiredParams.endpointHandler]
  )

  const updatedEndpointHandler =
    endpointIdx !== -1
      ? {
          ...endpoints,
          activeIdx: endpointIdx
        }
      : endpoints
  return {
    endpointHandler: updatedEndpointHandler,
    locations: coords
      ? coords.map((item: Coords, index: number) => ({
          ...locations[index],
          ...item
        }))
      : locations,
    profile: params[requiredParams.profile]
  }
}

export const extractQueryParams = (queryParams: string) => {
  const params = queryString.parse(queryParams)

  return Object.entries(params).reduce((parsedValues: OptionalParams, entry: any) => {
    if (optionalParamsMapping[entry[0]]) {
      return {
        ...parsedValues,
        [entry[0]]: stringToBoolean(entry[1])
      }
    } else {
      return parsedValues
    }
  }, {})
}

export const getUrlParamsDiff = (
  params: Params,
  prevParams: Params,
  queryParams: OptionalParams,
  prevQueryParams: OptionalParams
) => {
  let diff = findDiff(params, prevParams)

  if (Object.keys(diff).length === 0) {
    diff = findDiff(queryParams, prevQueryParams)
  } else {
    diff = Object.values(optionalParamsMapping).reduce((accum, paramKey) => {
      return {
        ...accum,
        // @ts-ignore
        [paramKey]: queryParams[paramKey]
      }
    }, diff)
  }
  return diff
}

export const updateUrl = (
  locations: LocationInfo[],
  profile: string,
  endpoint: string,
  history: History,
  location: BrowserLocation,
  mappedOptionalParams: OptionalParams
) => {
  const previousFullPath = (location.pathname + location.search).replace(/ /g, '%20')
  const path = generateFullPath(locations, profile, endpoint, mappedOptionalParams)
  if (previousFullPath !== path) {
    history.push(path)
  }
}

export const mapOptionalParameters = (
  optionalParams: OptionalParams,
  queryParams: OptionalParams,
  inverse: boolean = false
) => {
  return Object.entries(optionalParams).reduce(
    (mappedOptions: OptionalParams, entry: any) => {
      return {
        ...mappedOptions,
        // @ts-ignore
        [entry[inverse ? 1 : 0]]: queryParams[entry[inverse ? 0 : 1]] || false
      }
    },
    {}
  )
}
