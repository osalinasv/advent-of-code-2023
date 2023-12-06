import fs from 'node:fs/promises'

const WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const INITIALS = new Set(WORDS.map((w) => w[0]))
const WORD_VALUE = new Map(WORDS.map((w, i) => [w, i + 1], {}))

const BY_INITIAL = WORDS.reduce((g, w) => {
  g[w[0]] = g[w[0]] ?? []
  g[w[0]].push(w)

  return g
}, {})

main()

async function main() {
  const inputFile = await fs.open('./input.txt')
  let total = 0

  for await (const line of inputFile.readLines()) {
    const parsed = parseLine(line)
    total += parsed
  }

  console.log('TOTAL:', total)
}

function parseLine(line) {
  const digits = []
  let index = 0

  while (index < line.length) {
    if (line[index] >= '0' && line[index] <= '9') {
      digits.push(parseInt(line[index]))
      index++

      continue
    }

    if (INITIALS.has(line[index])) {
      const matchedWord = matchWordAtIndex(line, index)

      if (matchedWord) {
        digits.push(WORD_VALUE.get(matchedWord))
        index += matchedWord.length - 1

        continue
      }
    }

    index++
  }

  return digits.at(0) * 10 + digits.at(-1)
}

function matchWordAtIndex(line, index) {
  const potentialWords = BY_INITIAL[line[index]]

  for (const word of potentialWords) {
    if (word === line.substr(index, word.length)) {
      return word
    }
  }

  return null
}
