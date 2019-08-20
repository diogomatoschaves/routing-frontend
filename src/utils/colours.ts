import { Dict } from '../types'
import { lightenDarkenColor } from './functions'

export const MAIN_PETROL = '#00677f'
export const PETROL_7 = '#003340'
export const PETROL_6 = '#004355'
export const PETROL_5 = '#00566a'
export const PETROL_4 = '#007a93'
export const PETROL_3 = '#5097ab'
export const PETROL_2 = '#79aebf'
export const PETROL_1 = '#a6cad8'

export const MAIN_GREY = '#e6e6e6'
export const GREY_1 = '#e6e6e6'
export const GREY_2 = '#9e9e9e'
export const GREY_3 = '#707070'
export const GREY_4 = '#444444'
export const GREY_5 = '#e1e1e1'

export const BLACK = '#000000'
export const WHITE = '#FFFFFF'

export const VALUE_COLOR = '#5e4fa2'

export const NORMAL_INPUT = PETROL_4
export const FOCUSED_INPUT = PETROL_5
export const PROFILE_BACKGROUND = GREY_5


export const POLYLINE_COLOR = PETROL_3
export const ROUTING_SERVICE = PETROL_6
export const ROUTING_SERVICE_STATS = PETROL_5


// export const THIRD_PARTY_COLOR = '#8A0F00'
// export const THIRD_PARTY_STATS = '#C44D3D'
// export const THIRD_PARTY_POLYLINE = '#FFA99E'


// export const THIRD_PARTY_STATS = '#E03997'
export const THIRD_PARTY_STATS = '#B84843'
export const THIRD_PARTY_COLOR = '#C2292A'
export const THIRD_PARTY_POLYLINE = '#FF8E8E'

export const TRAFFIC_STATS = '#007841'
export const TRAFFIC_COLOR = '#004525'
export const TRAFFIC_POLYLINE = '#00C469'



export const colors: Dict = {
  '90+': '#9e0142', // purple
  '80-90': '#d53e4f', // blue
  '70-80': '#f46d43', // teal
  '60-70': '#fdae61', // green 
  '50-60': '#fee08b', // light green 
  '40-50': '#e6f598', // yellow
  '30-40': '#abdda4', // light orange
  '20-30': '#66c2a5', // orange
  '10-20': '#3288bd', // red
  '< 10': '#5e4fa2', // burgundy
}