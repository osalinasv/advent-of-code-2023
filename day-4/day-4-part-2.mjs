import fs from 'node:fs'

const cards = fs.readFileSync('./input.txt', 'utf8').split('\r\n')
let total = 0

const winsPerCard = new Map()

for (let index = 0; index < cards.length; index++) {
  const card = parseLine(cards[index])
  const wins = countWins(card)

  winsPerCard.set(index, wins)
}

const copyMemo = new Map()

for (let index = cards.length - 1; index >= 0; index--) {
  total += getRecursiveTotal(index)
}

console.log('TOTAL:', total)

function getRecursiveTotal(index) {
  if (copyMemo.has(index)) return copyMemo.get(index)

  const wins = winsPerCard.get(index)
  let totalCopies = 1

  let copyIndex = index + 1
  let winCount = wins

  while (winCount > 0 && copyIndex < cards.length) {
    totalCopies += getRecursiveTotal(copyIndex)

    winCount--
    copyIndex++
  }

  copyMemo.set(index, totalCopies)
  return totalCopies
}

function countWins(card) {
  let wins = 0

  for (const number of card.played) {
    if (!card.winning.has(number)) continue
    wins++
  }

  return wins
}

function parseLine(line) {
  const start = line.indexOf(':')
  const div = line.indexOf('|')

  const winningNumbersStr = line.substring(start + 1, div - 1).trim()
  const playedNumbersStr = line.substring(div + 1).trim()

  const winningNumbers = winningNumbersStr.split(/ +/).map((n) => parseInt(n))
  const playedNumbers = playedNumbersStr.split(/ +/).map((n) => parseInt(n))

  return {
    played: playedNumbers,
    winning: new Set(winningNumbers),
  }
}
