/**
 * Load config from a directory into a Sails app
 */

var includeAll = require('include-all')
var _ = require('lodash')
module.exports = function (sails, dir) {
  includeAll.optional({
    dirname: dir,
    exclude: ['locales', 'local.js', 'local.json', 'local.coffee', 'local.litcoffee'],
    excludeDirs: /(locales|env)$/,
    filter: /(.+)\.(js|json|coffee|litcoffee)$/,
    identity: false
  }, function (err, configs) {
    if (err) sails.log.error(err)
    sails.config = _.merge(configs, sails.config, (a, b) => _.isArray(a) ? a.concat(b) : undefined)
  })
}

