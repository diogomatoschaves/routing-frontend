/* eslint-disable func-names */
const http = require('http')

const route = async (req, res) => {
  const { x, y, z, profile } = req.params

  const url = `http://develop-routing-service-${profile}.develop:5000/v1/tile/${x},${y},${z}`

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-protobuf'
    }
  }

  new Promise(resolve => {
    http.get(url, options, function(response) {
      const data = []
      resolve(
        response
          .on('data', function(chunk) {
            data.push(chunk)
          })
          .on('end', function() {
            // at this point data is an array of Buffers
            // so Buffer.concat() can make us a new Buffer
            // of all of them together
            const buffer = Buffer.concat(data)
            // console.log(buffer.toString('base64'));
            res.status(200).send(buffer)
          })
      )
    })
  }).catch(error => {
    console.log(url)
    console.log(error)
    res.status(400).json({ message: 'bad request' })
  })

  // fetch(url, options)
  // .then(response => {

  //   // console.log(buffer)
  //   res.status(200).send(buffer)
  // })

  // res.status(200).send(response);
}

module.exports = route
