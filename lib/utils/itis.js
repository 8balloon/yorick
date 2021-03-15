/*
MIT No Attribution

Copyright 2019 Ethan Gregory Clark

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*

`is`-based DATA types
...i.e., functions that return `true` for values of that type
...for all values and non-function, default-prototype objects
...at a SHALLOW level.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures

May possibliy update to leverage community-consensus implementations and/or deep checking
*/

const valueDataTypes = {
  Null(v) { return v === null },
  Undefined(v) { return v === undefined },
  Boolean(v) { return typeof v === 'boolean' },
  Number(v) { return typeof v === 'number' }, // includes NaN, infinity
  BigInt(v) { return typeof v === 'bigint' },
  String(v) { return typeof v === 'string' },
  Symbol(v) { return typeof v === 'symbol' },
  Date(v) { return v instanceof Date },
  RegExp(v) { return v instanceof RegExp },
  Int8Array(v) { return v instanceof Int8Array },
  Uint8Array(v) { return v instanceof Uint8Array },
  Uint8ClampedArray(v) { return v instanceof Uint8ClampedArray },
  Int16Array(v) { return v instanceof Int16Array },
  Uint16Array(v) { return v instanceof Uint16Array },
  Int32Array(v) { return v instanceof Int32Array },
  Uint32Array(v) { return v instanceof Uint32Array },
  Float32Array(v) { return v instanceof Float32Array },
  Float64Array(v) { return v instanceof Float64Array },
  BigInt64Array(v) { return v instanceof BigInt64Array }, // eslint-disable-line
  BigUint64Array(v) { return v instanceof BigUint64Array }, // eslint-disable-line
  ArrayBuffer(v) { return v instanceof ArrayBuffer },
  DataView(v) { return v instanceof DataView },
}

const plainObjectProto = Object.getPrototypeOf({})

const collectionDataTypes = {
  PlainObject(v) { // an object with the object-literal prototye
    return v instanceof Object && Object.getPrototypeOf(v) === plainObjectProto
  },
  Array(v) {
    // return Array.isArray(v) // doesn't work with non-proxy mobx (v4)
    return Object.prototype.toString.call(v) === '[object Array]'
  },
  Map(v) { return v instanceof Map },
  Set(v) { return v instanceof Set },
  WeakMap(v) { return v instanceof WeakMap },
  WeakSet(v) { return v instanceof WeakSet },
}

const itis = {
  ...valueDataTypes,
  ...collectionDataTypes,
  Defined(v) {
    return !itis.Undefined(v)
  },
  Value(v) {
    return Object.values(valueDataTypes).some(dataType => dataType(v))
  },
  JsonValue(v) {
    return itis.Null(v) || itis.Boolean(v) || itis.Number(v) || itis.String(v)
  },
  Nullish(v) {
    return valueDataTypes.Null(v) || valueDataTypes.Undefined(v)
  },
  Collection(v) {
    return Object.values(collectionDataTypes).some(dataType => dataType(v))
  },
  JsonCollection(v) {
    return itis.PlainObject(v) || itis.Array(v)
  },
  Jsonish(v) {
    return itis.JsonValue(v) || itis.JsonCollection(v)
  },
  Function(v) {
    return v instanceof Function
  },
  Class(v) {
    return typeof v === 'function'
      && /^class\s/.test(Function.prototype.toString.call(v))
  },
  CustomObject(v) { // an object that is not a plain object
    return v instanceof Object && !itis.Collection(v) && !itis.Value(v)
  },
  Object(v) { // either a plain object or a custom object
    return itis.PlainObject(v) || itis.CustomObject(v)
  },
  Promise(v) {
    return (itis.Object(v) || itis.Function(v)) && itis.Function(v.then)
  },
  BasicProperty(o, p) { // i.e., not a custom "Object.defineProperty"-type property
    const d = Object.getOwnPropertyDescriptor(o, p)
    return 'value' in d && d.writable && d.enumerable && d.configurable
  },
  CustomProperty(o, p) {
    return !itis.BasicProperty(o, p)
  },
}

// are all unsupported nondata values encapsulated by itis.NonData.Object and itis.NonData.Function?

// add something which returns the type function of a value?

module.exports = itis
