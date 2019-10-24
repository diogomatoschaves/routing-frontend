import Match from './match'
import Route from './route'

export const Schema = {
  Match,
  Route
} as any

export const ReturnCode = {
  id: '/ReturnCode',
  description: 'aed',
  type: 'string',
  enum: [
    'Ok',
    'RequestViolatesConstraints',
    'SnappingFailed',
    'NoRoute',
    'NoMatch',
    'NoMatrix',
    'NoTile',
    'NoNearest',
    'GeneralError'
  ]
}
