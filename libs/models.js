/**
 * Load models from a directory into a Sails app
 */

var buildDictionary = require('sails-build-dictionary')

module.exports = function (sails, dir, cb) {
  buildDictionary.optional({
    dirname: dir,
    filter: /^([^.]+)\.(js|coffee|litcoffee)$/,
    replaceExpr: /^.*\//,
    flattenDirectories: true
  }, (err, models) => {
    if (err) return cb(err)

        // Get any supplemental files
    buildDictionary.optional({
      dirname: dir,
      filter: /(.+)\.attributes.json$/,
      replaceExpr: /^.*\//,
      flattenDirectories: true
    }, (err, supplements) => {
      if (err) return cb(err)
      let finalModels = {...models, supplements} || {}
      sails.hooks.orm.models = {...finalModels, ...sails.models}
      sails.models = sails.hooks.orm.models
      
      if (sails.config.globals.models === true) {
        for (let modelName in models) {
          let model = models[modelName]
          let globalId = model.globalId
          global[globalId] = model
        }
      }
      cb()
    })
  })
}
