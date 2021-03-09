// proudly coupled to optionator option structure

module.exports.globalOptions = [
  {
    option: 'help',
    alias: 'h',
    type: 'Boolean',
    description: 'displays help',
  },
  {
    option: 'context',
    type: 'String',
    description: 'The base directory, an absolute path, used as the starting point for searching for files and executing commands. Defaults to CWD (current working directory)',
  },
  {
    option: 'config',
    alias: 'c',
    type: 'String',
    description: 'Use this configuration, overriding yorick.config.js (if present)',
  },
]

module.exports.requiredSuiteOptions = [
  {
    option: 'run',
    alias: 'r',
    type: 'String',
    description: 'Command for yorick to run on every {{file}}',
  },
  {
    option: 'match',
    alias: 'm',
    type: 'String',
    description: 'The glob pattern Yorick uses to find {{file}}s. Use yorick.config.js to pass multiple glob patterns. '
  }
]

module.exports.requiredOptions = [
  ...module.exports.requiredSuiteOptions,
]
