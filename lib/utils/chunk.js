module.exports = function chunk(arr, chunkCount) {
  const chunkSize = Math.ceil(arr / chunkCount)
  const result = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}
