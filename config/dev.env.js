'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://quan-dev.xiaoheiban.cn/api/?method="',
  BASE_ROOT: '"http://quan-dev.xiaoheiban.cn/h5/index.html#/"'
})
