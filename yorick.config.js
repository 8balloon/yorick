module.exports = async () => {
  return {
    // mode: 'hybrid', // | 'local' | 'remote' // TODO

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
