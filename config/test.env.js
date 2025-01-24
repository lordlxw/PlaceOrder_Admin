'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  BASE_API: '"https://apitest.quants.top"',
  WS_URL: '"wss://apitest.quants.top/websocket"'
})
