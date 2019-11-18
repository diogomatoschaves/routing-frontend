import { mockCarResponse, mockFootResponse, mockCarTrafficResponse } from './mockResponse'
import mockGoogleResponse from './mockGoogleResponse'
import { mockValidDBResponse, mockInvalidDBResponse } from './mockDBResponse'

export const routingApi = jest.fn().mockImplementation((profile, authorization, body) => {
  if (body.locations[0].lat === 100) {
    return Promise.resolve({
      ...mockCarResponse,
      code: 'LocationInvalid'
    })
  }

  return profile === 'car'
    ? Promise.resolve(mockCarResponse)
    : profile === 'car-traffic'
    ? Promise.resolve(mockCarTrafficResponse)
    : Promise.resolve(mockFootResponse)
})

export const googleDirections = jest
  .fn()
  .mockImplementation((google, profile, locations) => {
    if (locations[0].lat === 100) {
      return Promise.resolve({
        ...mockGoogleResponse,
        status: 'ZERO_RESULTS'
      })
    }
    return Promise.resolve(mockGoogleResponse)
  })

export const fetchRouteDB = jest.fn().mockImplementation(routeId => {
  return routeId === 'AAA'
    ? Promise.resolve(mockValidDBResponse)
    : Promise.resolve(mockInvalidDBResponse)
})
