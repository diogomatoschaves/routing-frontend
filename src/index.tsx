/* eslint-disable global-require */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import * as serviceWorker from './serviceWorker'
import 'semantic-ui-css/semantic.min.css'
import App from './components/App'
import { getPath, urlMatchString } from './utils/urlConfig'

const rootEl = document.getElementById('root')

ReactDOM.render(
  <Router>
    <Route
      render={({ location }) => (
        <Route
          path={getPath(location.pathname)}
          render={({ location: newLocation, history, match }) => (
            <App
              location={newLocation}
              history={history}
              match={match}
              urlMatchString={urlMatchString}
            />
          )}
        />
      )}
    />
  </Router>,
  rootEl
)
