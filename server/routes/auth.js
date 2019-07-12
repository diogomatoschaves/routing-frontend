/* eslint-disable func-names */
const http = require('http')

const auth = async (req, res) => {
  const basicAuth = req.get('Authorization')
  return res.status(200).json({ basicAuth })
}

module.exports = auth
