import { mockCarResponse, mockFootResponse } from './mockResponse'
import mockGoogleResponse from './mockGoogleResponse'

export const routingApi = jest.fn()
  .mockImplementation((profile, authorization, locations) => {
    return profile === 'car' ? Promise.resolve(mockCarResponse) : Promise.resolve(mockFootResponse) 
  })

export const googleDirections = jest.fn()
  .mockImplementation((google, profile, locations) => {
    return Promise.resolve(mockGoogleResponse)
  })


 
