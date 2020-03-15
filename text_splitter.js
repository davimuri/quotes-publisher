
const split = (text, maxSize, addEllipsis = false, addCounter = false) => {
  let startIndex = 0
  let endIndex = 0
  let splittedText = []

  while (startIndex < text.length) {
    endIndex = findSplitIndex(text, maxSize, startIndex)
    splittedText.push(text.substring(startIndex, endIndex))
    startIndex = endIndex
    if (text.charAt(endIndex) === ' ') {
      startIndex += 1
    }
  }
  return addEllipsis || addCounter
    ? decorate(splittedText, addEllipsis, addCounter)
    : splittedText
}

const findSplitIndex = (text, maxSize, startIndex) => {
  let endIndex = Math.min(startIndex + maxSize, text.length)
  if (endIndex < text.length) {
    while (endIndex > 0 && text.charAt(endIndex) !== ' ') 
      endIndex -= 1

    if (endIndex === 0)
      endIndex = Math.min(startIndex + maxSize, text.length)
  }

  return endIndex
}

const decorate = (splittedText, addEllipsis = false, addCounter = false) => {
  let phrases = []
  if (splittedText.length === 1) {
    phrases.push(splittedText[0])
  } else {
    for (let i = 0; i < splittedText.length - 1; i++) {
      let text = splittedText[i]
      if (addEllipsis) text = text.concat('...')
      if (addCounter) text = text.concat(` ${i+1}/${splittedText.length}`)
      phrases.push(text)
    }
    let text = splittedText[splittedText.length-1]
    if (addCounter) text = text.concat(` ${splittedText.length}/${splittedText.length}`)
    phrases.push(text)
  }
  return phrases
}

module.exports = split 