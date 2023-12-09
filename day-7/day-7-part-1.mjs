import fs from 'node:fs'

const cards = 'AKQJT98765432'.split('')
const scores = new Map(cards.map((c, i) => [c, i]))

const input = fs.readFileSync(process.argv[2], 'utf8')
const set = input.split('\r\n').map(parseSet)

set.sort((a, b) => {
  if (a === b) return 0
  if (a.rank > b.rank) return 1
  if (a.rank < b.rank) return -1

  for (let index = 0; index < a.asScores.length; index++) {
    if (a.asScores[index] < b.asScores[index]) {
      return 1
    }

    if (a.asScores[index] > b.asScores[index]) {
      return -1
    }
  }

  return -1
})

let total = 0
for (let index = 0; index < set.length; index++) {
  total += set[index].bid * (index + 1)
}

console.log({ total })

function parseSet(line) {
  const [hand, bid] = line.split(' ')
  const asScores = toScores(hand)
  const rank = rankHand(asScores)

  return {
    hand,
    bid: parseInt(bid),
    rank,
    asScores,
  }
}

function toScores(hand) {
  return hand.split('').map((c) => scores.get(c))
}

function rankHand(hand) {
  const count = new Map()
  for (const card of hand) {
    count.set(card, (count.get(card) ?? 0) + 1)
  }

  if (count.size === 1) {
    return 7
  }

  const values = Array.from(count.values())
  values.sort((a, b) => b - a)

  if (count.size === 2) {
    if (values[0] === 4) return 6
    return 5
  }

  if (count.size === 3) {
    if (values[0] === 3) return 4
    return 3
  }

  if (values[0] === 2) return 2
  return 1
}
