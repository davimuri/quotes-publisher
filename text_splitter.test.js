const split = require('./text_splitter')

test('text smaller than maxSize', () => {
  const test = 'abc'
  splitted = split(test, 4)
  expect(splitted).toEqual(['abc'])
})

test('text length equal than maxSize', () => {
  const test = 'abc'
  splitted = split(test, 3)
  expect(splitted).toEqual(['abc'])
})

test('text with/without spaces', () => {
  const test = 'ab c'
  splitted = split(test, 1)
  expect(splitted).toEqual(['a', 'b', 'c'])
})

test('text with spaces at the end', () => {
  const test = 'ab c '
  splitted = split(test, 1)
  expect(splitted).toEqual(['a', 'b', 'c'])
})

test('text without spaces', () => {
  const test = 'ab c'
  splitted = split(test, 1)
  expect(splitted).toEqual(['a', 'b', 'c'])
})

test('a b c maxSize 1 split', () => {
  const test = 'a b c'
  splitted = split(test, 1)
  expect(splitted).toEqual(['a', 'b', 'c'])
})

test('ab c maxSize 2 split', () => {
  const test = 'ab c'
  splitted = split(test, 2)
  expect(splitted).toEqual(['ab', 'c'])
})

test('a bc maxSize 2 split', () => {
  const test = 'a bc'
  splitted = split(test, 2)
  expect(splitted).toEqual(['a', 'bc'])
})

test('a b c maxSize 2 split', () => {
  const test = 'a b c'
  splitted = split(test, 2)
  expect(splitted).toEqual(['a', 'b', 'c'])
})

test('a b c maxSize 2 split', () => {
  const test = 'a b c'
  splitted = split(test, 2)
  expect(splitted).toEqual(['a', 'b', 'c'])
})

test('text split with ellipsis', () => {
  const test = 'abc'
  splitted = split(test, 1, true)
  expect(splitted).toEqual(['a...', 'b...', 'c'])
})

test('text split without ellipsis', () => {
  const test = 'abc'
  splitted = split(test, 3, true)
  expect(splitted).toEqual(['abc'])
})
