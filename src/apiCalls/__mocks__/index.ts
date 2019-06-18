import mockServerResponse from './mockResponse'
import mockGoogleResponse from './mockGoogleResponse'

export const routingApi = jest.fn()
  .mockImplementation((profile, authorization, locations) => {
    return Promise.resolve(mockServerResponse)
  })

export const googleDirections = jest.fn()
  .mockImplementation((google, profile, locations) => {
    return Promise.resolve(mockGoogleResponse)
  })


 
