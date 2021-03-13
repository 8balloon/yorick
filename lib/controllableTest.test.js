test('fails if process.env.FAIL is set', async () => {
  expect(true).toBe(process.env.FAIL ? false : true)
})
