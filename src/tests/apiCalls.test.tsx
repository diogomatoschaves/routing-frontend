import mockServerResponse from '../apiCalls/__mocks__/mockResponse'
import { routingApi } from '../apiCalls'

jest.mock('../apiCalls')

const locations = [{
  lat: 52.494632109285874, 
  lon: 13.3346555610201
}, {
  lat: 52.500377513986365, 
  lon: 13.346008562133875
}] as any

// window.fetch = jest.fn().mockImplementation(() => ({
//   status: 200,
//   json: () => Promise.resolve(mockServerResponse)
// }))

// window.fetch = jest.fn().mockImplementation((geography, authorization, locations) => {
//   console.log('mock api fetch was called')
//   return {
//     status: 200,
//     json: () => new Promise((resolve, reject) => resolve(mockServerResponse))
//   }
// })

describe('Api Calls', () => {
  
  describe('routingApi', () => {
    
    it('returns an object if status code is ok', (done) => {

      routingApi('car', 'Basic RE1BVE9TQzpPbGlzc2lwbzE5ODY=', locations)
      .then((response) => {
        expect(response).toEqual(mockServerResponse)
        done()
      })
    })
  })
})