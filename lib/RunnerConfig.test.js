const { RunnerConfig } = require('./RunnerConfig')

xtest('it makes a non-insane config from cli', async () => {
  const config = await RunnerConfig(process.cwd(), ['_', '_', '--run', 'echo {{file}}', '--match', '**/**'])
  await expect(config).toMatchObject({
    context: process.cwd(),
    suites: [
      { run: 'echo {{file}}', match: '**/**' }
    ],
  })
})

xtest('it makes a non-insane config from file', async () => {
  const configFileConfig = {
    context: '/foo/bar',
    suites: [
      { run: 'echo {{file}}', match: '**/**' },
    ]
  }
  const spy = jest.spyOn(RunnerConfig, 'getConfigGetter')
  spy.mockImplementation(() => () => configFileConfig)
  await RunnerConfig(process.cwd(), [])
  spy.mockRestore()
})
