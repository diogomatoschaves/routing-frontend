import mockServerResponse from './mockResponse'

export const routingApi = jest.fn()
  .mockImplementation((profile, authorization, locations) => {
    return Promise.resolve(mockServerResponse)
  })
 
