const Mustache = require('mustache')
Mustache.escape = function(text) {return text}

module.exports = (text, variableMap) => Mustache.render(text, variableMap)
