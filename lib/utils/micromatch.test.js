const mm = require('micromatch')

test('micromatch works how I think it does', async () => {
  const matches = mm(['testFile1.js', 'foo.js'], ['testFile*'])
  expect(matches).toEqual(['testFile1.js'])
})
