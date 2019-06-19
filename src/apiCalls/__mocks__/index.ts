import { mockCarResponse, mockFootResponse } from './mockResponse'

export const routingApi = jest.fn()
  .mockImplementation((profile, authorization, locations) => {
    return profile === 'car' ? Promise.resolve(mockCarResponse) : Promise.resolve(mockFootResponse) 
  })
 
