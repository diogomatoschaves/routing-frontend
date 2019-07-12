/* eslint-disable func-names */
const { Router } = require('express')
const parser = require('body-parser').json()
// const path = require('path')

const router = new Router()

router.get('/tile/:profile/:x,:y,:z', parser, require('./tile'))
router.post('/route/:profile', parser, require('./route'))
router.get('/auth', parser, require('./auth'))

module.exports = router
