/* eslint-disable global-require */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import * as serviceWorker from './serviceWorker'
import 'semantic-ui-css/semantic.min.css'
import App from './components/App'
import { getPath } from './utils/urlConfig'

const rootEl = document.getElementById('root')
const urlMatchString = '/:profile/:start/:end'

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

if ((module as any).hot) {
  (module as any).hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default
    ReactDOM.render(
      <Router>
        <NextApp />
      </Router>,
      rootEl
    )
  })
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
