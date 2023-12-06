import fs from 'node:fs'

const lines = fs.readFileSync('./input.txt', 'utf8').split('\r\n')

const symbols = []
const numbers = []
let current = null

for (let row = 0; row < lines.length; row++) {
  const line = lines[row]
  let column = 0

  for (; column < line.length; column++) {
    const character = line[column]

    if (character >= '0' && character <= '9') {
      if (current) current[3] += character
      else current = [row, column, null, character]

      continue
    }

    if (current) {
      current[2] = column - 1
      current[3] = parseInt(current[3])
      numbers.push(current)

      current = null
    }

    if (character !== '.') {
      symbols.push([column, row])
    }
  }

  if (current) {
    current[2] = column - 1
    current[3] = parseInt(current[3])
    numbers.push(current)

    current = null
  }
}

const symbolsByRow = symbols.reduce((groups, symbol) => {
  groups[symbol[1]] = groups[symbol[1]] ?? []
  groups[symbol[1]].push(symbol[0])

  return groups
}, {})

const adjacentNumbers = []
let total = 0

for (const number of numbers) {
  if (checkAdjacency(number)) {
    adjacentNumbers.push(number[3])
    total += number[3]
  }
}

console.log('TOTAL:', total)

function checkAdjacency(number) {
  const baseRow = number[0]
  const minColumn = number[1] - 1
  const maxColumn = number[2] + 1

  const rows = [baseRow - 1, baseRow, baseRow + 1]
  for (const row of rows) {
    if (checkAdjacencyInRow(row, minColumn, maxColumn)) {
      return true
    }
  }

  return false
}

function checkAdjacencyInRow(row, minColumn, maxColumn) {
  const symbolsInRow = symbolsByRow[row]
  if (!symbolsInRow) return false

  for (const column of symbolsInRow) {
    if (column >= minColumn && column <= maxColumn) {
      return true
    }
  }

  return false
}
