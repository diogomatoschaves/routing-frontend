import round from 'lodash/round'

export const formatCoords = (coords) => `${round(coords.lat, 3)}, ${round(coords.lng, 3)}`