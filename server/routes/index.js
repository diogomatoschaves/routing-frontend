/* eslint-disable func-names */
const { Router } = require('express')
const parser = require('body-parser').json()

const router = new Router()

router.get('/tile/:profile/:x,:y,:z', parser, require('./tile'))
router.post('/route/:profile', parser, require('./route'))
router.get('/auth', parser, require('./auth'))
router.get('/search', parser, require('./db'))

module.exports = router
