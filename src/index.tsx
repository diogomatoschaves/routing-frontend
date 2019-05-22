/* eslint-disable global-require */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import 'semantic-ui-css/semantic.min.css'

const rootEl = document.getElementById('root')

ReactDOM.render(<App />, rootEl)

if ((module as any).hot) {
  (module as any).hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default
    ReactDOM.render(<NextApp />, rootEl)
  })
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
