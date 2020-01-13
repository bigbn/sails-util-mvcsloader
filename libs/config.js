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
    sails.config = _.merge({},  sails.config, configs, (a, b) => _.isArray(a) ? a.concat(b) : undefined)    
    let mapping = sails.hooks.policies.buildPolicyMap()
    
    for (let controllerName in configs.policies) {
      var controller = controllerName.replace(/Controller$/,'').toLowerCase()
      for (let actionName in configs.policies[controllerName]) {
        const policies = configs.policies[controllerName][actionName]
        const key = controller + '/' + actionName.toLowerCase()
        sails.registerActionMiddleware(mapping[key], key)
      }
    }
    
    // There is still the issue with global false policy (*: False)
    // Maybe this peaces somehow can help in future 
    
    // let wideKey = Object.keys(mapping).find((key) => key.startsWith('*'))
    // let wideActions = mapping[wideKey]

    // let existingWideKeys = Object.keys(sails._actionMiddleware).filter((key) => key.startsWith('*'))
    // existingWideKeys.forEach(key => delete sails._actionMiddleware[wideKey])    
    // sails.registerActionMiddleware(wideActions, wideKey);
  })
}

