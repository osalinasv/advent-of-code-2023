import fs from 'node:fs'

const lines = fs.readFileSync('./input.txt', 'utf8').split('\r\n')

let row = 0
let column = 0

const numbersBySymbol = {}
const numbers = []

let currentNumber = null
let currentNumberStart = 0
let currentAdjacentSymbols = []

while (row < lines.length && column < lines[row].length) {
  if (lines[row][column] >= '0' && lines[row][column] <= '9') {
    appendDigitToCurrentNumber(lines[row][column], column)

    const symbols = findAdjacentSymbols(row, column)
    if (symbols.length > 0) {
      currentAdjacentSymbols = currentAdjacentSymbols.concat(symbols)
    }
  } else {
    if (currentNumber) closeCurrentNumber(row, column - 1)
  }

  column++
  if (column >= lines[row].length) {
    closeCurrentNumber(row, column - 1)

    column = 0
    row++
  }
}

let totalGearRatio = 0

for (const symbol in numbersBySymbol) {
  const numbers = numbersBySymbol[symbol]
  if (!numbers || numbers.length !== 2) continue

  totalGearRatio += numbers[0] * numbers[1]
}

console.log('TOTAL GEAR RATIO:', totalGearRatio)

function appendDigitToCurrentNumber(digit, column) {
  if (currentNumber) {
    currentNumber += digit
  } else {
    currentNumberStart = column
    currentNumber = digit
  }
}

function closeCurrentNumber(row, column) {
  if (!currentNumber) return

  const numberValue = parseInt(currentNumber)
  const numberInfo = {
    value: numberValue,
    row,
    start: currentNumberStart,
    end: column,
  }

  if (currentAdjacentSymbols && currentAdjacentSymbols.length > 0) {
    const symbols = new Set(currentAdjacentSymbols)

    for (const symbol of symbols) {
      numbersBySymbol[symbol] = numbersBySymbol[symbol] ?? []
      numbersBySymbol[symbol].push(numberValue)
    }
  }

  numbers.push(numberInfo)

  currentNumber = null
  currentNumberStart = 0
  currentAdjacentSymbols = []
}

function findAdjacentSymbols(row, column) {
  const symbols = []

  const positions = [
    [row - 1, column - 1],
    [row - 1, column],
    [row - 1, column + 1],
    [row, column - 1],
    [row, column],
    [row, column + 1],
    [row + 1, column - 1],
    [row + 1, column],
    [row + 1, column + 1],
  ]

  for (const position of positions) {
    const [posRow, posCol] = position

    if (posRow < 0 || posRow >= lines.length || posCol < 0 || posCol >= lines[posRow].length) {
      continue
    }

    if (isSymbol(lines[posRow][posCol])) {
      symbols.push(`${posRow}.${posCol}.${lines[posRow][posCol]}`)
    }
  }

  return symbols
}

function isSymbol(character) {
  return character !== '.' && (character < '0' || character > '9')
}
