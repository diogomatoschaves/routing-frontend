import { mockCarResponse, mockFootResponse } from './mockResponse'
import mockGoogleResponse from './mockGoogleResponse'
import { mockValidDBResponse, mockInvalidDBResponse } from './mockDBResponse'

export const routingApi = jest.fn()
  .mockImplementation((profile, authorization, locations) => {
    return profile === 'car' || profile === 'car-traffic' ? Promise.resolve(mockCarResponse) : Promise.resolve(mockFootResponse) 
  })

export const googleDirections = jest.fn()
  .mockImplementation((google, profile, locations) => {
    return Promise.resolve(mockGoogleResponse)
  })

export const fetchRouteDB = jest.fn()
  .mockImplementation((routeId) => {
    return routeId === 'AAA' ? Promise.resolve(mockValidDBResponse) : Promise.resolve(mockInvalidDBResponse) 
  })


 
