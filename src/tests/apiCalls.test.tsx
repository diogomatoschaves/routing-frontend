import { mockCarResponse, mockFootResponse } from '../apiCalls/__mocks__/mockResponse'
import { routingApi } from '../apiCalls'

jest.mock('../apiCalls')

const locations = [{
  lat: 52.494632109285874, 
  lon: 13.3346555610201
}, {
  lat: 52.500377513986365, 
  lon: 13.346008562133875
}] as any

describe('Api Calls', () => {
  
  describe('routingApi with car profile', () => {

    const mockProfile = 'car'
    
    it('returns an object if status code is ok', (done) => {

      routingApi(mockProfile, 'Basic RE1BVE9TQzpPbGlzc2lwbzE5ODY=', locations)
      .then((response) => {
        expect(response).toEqual(mockCarResponse)
        done()
      })
    })
  })

  describe('routingApi with foot profile', () => {

    const mockProfile = 'foot'
    
    it('returns an object if status code is ok', (done) => {

      routingApi(mockProfile, 'Basic RE1BVE9TQzpPbGlzc2lwbzE5ODY=', locations)
      .then((response) => {
        expect(response).toEqual(mockFootResponse)
        done()
      })
    })
  })
})