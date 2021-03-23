// proudly coupled to optionator option structure

module.exports = [
  {
    option: 'help',
    alias: 'h',
    type: 'Boolean',
    description: 'display help',
  },
  {
    option: 'config',
    alias: 'c',
    type: 'String',
    description: 'use this configuration, overriding yorick.config.js (if present)',
  },
  {
    option: 'only',
    alias: 'o',
    type: 'String',
    description: 'limit tests to those that match suite fileParamMatch + this glob pattern',
  },
]
