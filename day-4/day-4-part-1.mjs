import fs from 'node:fs'

const lines = fs.readFileSync('./input.txt', 'utf8').split('\r\n')
let total = 0

for (const line of lines) {
  const parsed = parseLine(line)
  let points = 0

  for (const number of parsed.playedNumbers) {
    if (!parsed.winingNumbers.has(number)) continue
    points = points === 0 ? 1 : points * 2
  }

  total += points
}

console.log('TOTAL:', total)

function parseLine(line) {
  const start = line.indexOf(':')
  const div = line.indexOf('|')

  const winingNumbersStr = line.substring(start + 1, div - 1).trim()
  const playedNumbersStr = line.substring(div + 1).trim()

  const winingNumbers = winingNumbersStr.split(/ +/).map((n) => parseInt(n))
  const playedNumbers = playedNumbersStr.split(/ +/).map((n) => parseInt(n))

  return {
    winingNumbers: new Set(winingNumbers),
    playedNumbers,
  }
}
