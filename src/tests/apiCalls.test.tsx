import React from 'react'
import { mockServerResponse } from './__mocks__/apiCalls'
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
  
  describe('routingApi', () => {
    
    it('returns an object if status code is ok', () => {
      window.fetch = jest.fn().mockImplementation(() => ({
        status: 200,
        json: () => new Promise((resolve, reject) => {
          resolve(mockServerResponse)
        })
      }))
  
      expect(routingApi('car', 'Basic RE1BVE9TQzpPbGlzc2lwbzE5ODY=', locations))
      .resolves.toEqual(mockServerResponse)
    })
  })
})