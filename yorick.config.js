module.exports = async () => {
  return {
    // mode: 'hybrid', // | 'local' | 'remote' // TODO

    suites: [
      {
        name: 'mySuite',
        dockerfile: 'yorick.Dockerfile',
        run: 'echo hello world',
        fileMatch: [/* matchers */],
        syncIgnore: [/* matchers */],

        // getDockerBuildArgs // later -- if necessary
        // getDockerRunArgs
      }
    ],
  }
}
