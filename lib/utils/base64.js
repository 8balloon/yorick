module.exports = {
  encode(str) {
    return Buffer.from(str).toString('base64')
  },
  decode(base64Str) {
    return Buffer.from(base64Str).toString()
  },
}
