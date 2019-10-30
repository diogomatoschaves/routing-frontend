import { Location } from '../types'
import { splitCoords } from './functions'

interface Params {
  start: string
  end: string
  profile: string
  [key: string]: string
}

const requiredParams: Params = {
  profile: 'profile',
  start: 'start',
  end: 'end'
}

const matchingParams = ['/:profile', '/:start', '/:end']

export const checkUrlValidity = (params: Params, acceptableProfiles: string[]) => {
  const paramsKeys = Object.keys(params)

  return (
    paramsKeys.length === 3 &&
    paramsKeys.every((el: string) => {
      return (
        ([requiredParams.start, requiredParams.end].includes(el) &&
          Boolean(splitCoords(params[el]))) ||
        (el === requiredParams.profile && acceptableProfiles.includes(params[el]))
      )
    })
  )
}

export const getPath = (pathname: string) => {
  const splitUrl = pathname.split('/')

  let usedIndex = -1

  return splitUrl.length > 4
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

export const extractUrlParams = (locations: Location[], params: Params) => {
  return {
    locations: locations.map((item: Location) => ({
      ...item,
      ...splitCoords(params[requiredParams[item.name]])
    })),
    profile: params[requiredParams.profile]
  }
}
