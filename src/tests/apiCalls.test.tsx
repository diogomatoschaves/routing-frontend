import { mockCarResponse, mockFootResponse } from '../apiCalls/__mocks__/mockResponse'
import { mockValidDBResponse, mockInvalidDBResponse } from '../apiCalls/__mocks__/mockDBResponse'
import { routingApi, fetchRouteDB } from '../apiCalls'

jest.mock('../apiCalls')

const locations = [
  {
    lat: 52.494632109285874,
    lon: 13.3346555610201
  },
  {
    lat: 52.500377513986365,
    lon: 13.346008562133875
  }
] as any

const mockEndpoint = 'https://routing.develop.otonomousmobility.com'

describe('Api Calls', () => {
  describe('routingApi with car profile', () => {
    const mockProfile = 'car'

    it('returns an object if status code is ok', done => {
      routingApi(mockProfile, 'Basic MOCKAUTH', locations, mockEndpoint).then(
        response => {
          expect(response).toEqual(mockCarResponse)
          done()
        }
      )
    })
  })

  describe('routingApi with foot profile', () => {
    const mockProfile = 'foot'

    it('returns an object if status code is ok', done => {
      routingApi(mockProfile, 'Basic MOCKAUTH', locations, mockEndpoint).then(
        response => {
          expect(response).toEqual(mockFootResponse)
          done()
        }
      )
    })
  })

  describe('fetchRoutesDB behaviour', () => {
    
    const mockValidRouteId = 'AAA'
    const mockInvalidRouteId = ''

    it('returns a response if route is found', done => {
      fetchRouteDB(mockValidRouteId).then(
        response => {
          expect(response).toEqual(mockValidDBResponse)
          done()
        }
      )
    })

    it('returns a response if route is not found', done => {
      fetchRouteDB(mockInvalidRouteId).then(
        response => {
          expect(response).toEqual(mockInvalidDBResponse)
          done()
        }
      )
    })
  })
})
