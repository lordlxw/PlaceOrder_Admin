'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"simulation"',
  BASE_API: '"https://simapi.quants.top"',
  WS_URL: '"wss://simapi.quants.top/websocket"'
})
