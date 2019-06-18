const fetch = require('node-fetch')

const route = async (req, res) => {
  const { profile } = req.params

  const body = JSON.stringify(req.body)

  const url = `http://develop-routing-service-${profile}.develop-routing-service:5000/v1/route`
  // const url = `https://routing.staging.otonomousmobility.com/${profile}/v1/route`

  fetch(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(response => res.status(200).json(response))
    .catch(error => {
      console.log(error)
      res.status(400).json({ message: 'bad request' })
    })
}

module.exports = route
