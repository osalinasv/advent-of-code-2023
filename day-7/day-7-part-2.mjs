import fs from 'node:fs'

const cards = 'AKQT98765432J'.split('')
const scores = new Map(cards.map((c, i) => [c, i]))
const joker = scores.get('J')

const input = fs.readFileSync(process.argv[2], 'utf8')
const set = input.split('\r\n').map(parseSet)

// test('AAAAA', 7)
// test('AAAAQ', 6)
// test('AAAQQ', 5)
// test('AAAQK', 4)
// test('AAQQK', 3)
// test('AAQK2', 2)
// test('AQK23', 1)

// test('AAAAJ', 7)
// test('AAAJJ', 7)
// test('AAJJJ', 7)
// test('AJJJJ', 7)
// test('AJJJJ', 7)
// test('JJJJJ', 7)

// test('AAAQJ', 6)
// test('AAQJJ', 6)
// test('AQJJJ', 6)

// test('AAQQJ', 5)
// test('AAQKJ', 4)
// test('AQK2J', 2)

// function test(hand, exp) {
//   const res = rankHand(toScores(hand))
//   console.log(hand, res, exp == res ? '\x1b[1;32myes' : `\x1b[1;31mno (${exp})`, '\x1b[0m')
// }

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
  let jokers = 0

  for (const card of hand) {
    if (card === joker) jokers++
    else count.set(card, (count.get(card) ?? 0) + 1)
  }

  if (count.size < 2) {
    return 7
  }

  const values = Array.from(count.values())
  values.sort((a, b) => b - a)

  if (count.size === 2) {
    if (values[0] + jokers === 3) return 5
    if (values[0] + jokers === 4) return 6
    if (values[0] === 4) return 6
    return 5
  }

  if (count.size === 3) {
    if (values[0] + jokers === 3) return 4
    if (values[0] === 3) return 4
    return 3
  }

  if (values[0] === 2) return 2
  if (jokers === 1) return 2

  return 1
}
