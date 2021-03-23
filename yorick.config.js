/*
module.exports = async () => {
  return {
    local: Boolean,
    remote: ...something else,
    suites: [
      {
        name: String,
        dockerfile: String,
        getRunCommands: ({ files }) => [`yarn jest ${files.join(' ')}`],
        runFiles: {
          match: [],
          ignore: [],
        },

        // this may not be necessary -- we could just send the full diff.
        syncFiles: {
          match: [],
          ignore: [],
        },
      },
    ],
  }
}
*/

module.exports = async () => {
  return {

    // local: Boolean = true, // TODO
    // remote: // TODO: some sort of "mode" control

    suites: [
      {
        name: 'mySuite',
        dockerfile: 'yorick.Dockerfile',
        // runCommand: 'echo {{file}}',
        runCommand: 'yarn jest {{file}}', // or ({ file }) => string | string[]
        // fileParam: {
        //   match:
        //   ignore:
        // },
        // sync: {
        //   match:
        //   ignore:
        // }
        fileParamMatch: ['**/*.test.js'],
        fileParamIgnore: ['**/node_modules/**'],
        syncIgnore: [/* matchers */],

        // getDockerBuildArgs // later -- if necessary
        // getDockerRunArgs
      }
    ],
  }
}
