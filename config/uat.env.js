'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"uat"',
  BASE_API: '"https://apiuat.quants.top"',
  WS_URL: '"wss://apiuat.quants.top/websocket"'
})
