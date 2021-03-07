const render = require('../lib/renderWithMustache')

test('command rendering works the way I think it does', async () => {
  expect(
    render('hello, {{name}}', { name: 'Ethan' })
  ).toEqual('hello, Ethan')
})
