import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Input } from 'semantic-ui-react'
// import 'jest-dom/extend-expect'
import App from '../components/App'


jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  GeolocateControl: jest.fn(),
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
    remove: jest.fn()
  })),
  NavigationControl: jest.fn()
}));

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

describe('Start point Input updates App state on Blur', () => {

  test('', async () => {

    const testInstance = TestRenderer.create(<App />)
    const root = testInstance.root
    
    const input = root.findAllByType(Input);

    input[0].props.onChange('', { value: 'test' })
    input[0].props.onBlur()

    await delay(500)

    const AppComponent = root.findByType(App);

    const { locations } = AppComponent.instance.state
    const startPoint = locations.find((el: any) => el.name === 'start')

    expect(startPoint.point).toBe('test');

  })
})

describe('End point Input updates App state on Blur', () => {

  test('', async () => {

    const testInstance = TestRenderer.create(<App />)
    const root = testInstance.root
    
    const input = root.findAllByType(Input);

    input[1].props.onChange('', { value: 'test' })
    input[1].props.onBlur()

    await delay(500)

    const AppComponent = root.findByType(App);

    const { locations } = AppComponent.instance.state
    const endPoint = locations.find((el: any) => el.name === 'end')

    expect(endPoint.point).toBe('test');

  })
})

