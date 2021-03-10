const { RunnerConfig } = require('./RunnerConfig')

test('it makes a non-insane config from cli', async () => {
  const config = await RunnerConfig(process.cwd(), ['_', '_', '--run', 'echo {{file}}', '--match', '**/**'])
  await expect(config).toMatchObject({
    context: '/home/ethan/play/yorick',
    suites: [
      { run: 'echo {{file}}', match: '**/**' }
    ],
  })
})

xtest('throws on invalid cli options', async () => {
  await expect(RunnerConfig(process.cwd(), ['_', '_', '--run', 'echo {{file}}', '--match', '**/**', 'lsagjklsj'])).rejects.toThrow(
    'missing option(s): "match". Either specify via "--match" or include in every yorick.config.js "suites" array object'
  )
})

test('throws on missing "match" option (cli)', async () => {
  await expect(RunnerConfig(process.cwd(), ['_', '_', '--run', 'echo {{file}}'])).rejects.toThrow(
    'missing option(s): "match". Either specify via "--match" or include in every yorick.config.js "suites" array object'
  )
})

test('throws on missing "run" option (cli)', async () => {
  await expect(RunnerConfig(process.cwd(), ['_', '_', '--match', '**/**'])).rejects.toThrow(
    'missing option(s): "run". Either specify via "--run" or include in every yorick.config.js "suites" array object'
  )
})

test('throws on missing "match" option (file)', async () => {
  const configFileConfig = {
    context: '/foo/bar',
    suites: [
      { run: 'echo {{file}}', match: '**/**' },
      { run: 'yolo {{file}}' },
    ]
  }
  const spy = jest.spyOn(RunnerConfig, 'getConfigGetter')
  spy.mockImplementation(() => () => configFileConfig)
  await expect(RunnerConfig(process.cwd(), [])).rejects.toThrow(
    'missing option(s): "match". Either specify via "--match" or include in every yorick.config.js "suites" array object'
  )
  spy.mockRestore()
})

test('throws on missing "run" option', async () => {
  const configFileConfig = {
    context: '/foo/bar',
    suites: [
      { match: '**/**' },
    ]
  }
  const spy = jest.spyOn(RunnerConfig, 'getConfigGetter')
  spy.mockImplementation(() => () => configFileConfig)
  await expect(RunnerConfig(process.cwd(), [])).rejects.toThrow(
    'missing option(s): "run". Either specify via "--run" or include in every yorick.config.js "suites" array object'
  )
  spy.mockRestore()
})

test('it makes a non-insane config from file', async () => {
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
