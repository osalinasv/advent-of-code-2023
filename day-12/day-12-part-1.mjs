import fs from 'node:fs'

const input = fs.readFileSync(process.argv[2], 'utf8')
const records = parseRecords(input)

let total = 0
for (const record of records) {
  const arrangements = getArrangements(record)
  total += arrangements
}

console.log({ total })

function getArrangements(record) {
  const line = []
  const unknowns = []

  for (let index = 0; index < record.map.length; index++) {
    const spring = record.map[index]
    switch (spring) {
      case '.':
        line.push(0)
        break
      case '#':
        line.push(1)
        break
      default:
        line.push(-1)
        unknowns.push(index)
        break
    }
  }

  let arrangements = 0
  const combinations = 1 << unknowns.length // 2^n

  for (let combinationMask = 0; combinationMask < combinations; combinationMask++) {
    const lineCopy = [...line]
    for (let index = 0; index < unknowns.length; index++) {
      lineCopy[unknowns[index]] = combinationMask & (1 << index) ? 0 : 1
    }

    if (matchesTargets(lineCopy, record.counts)) {
      arrangements++
    }
  }

  return arrangements
}

function matchesTargets(line, targets) {
  let targetIndex = 0
  let currentCount = 0

  let index = 0
  while (index <= line.length) {
    if (currentCount > 0 && !line[index]) {
      if (currentCount !== targets[targetIndex]) {
        return false
      }

      currentCount = 0
      targetIndex++
    } else if (line[index]) {
      currentCount++
    }

    index++
  }

  return targetIndex == targets.length
}

function parseRecords(input) {
  return input.split('\r\n').map(parseRecord)
}

function parseRecord(line) {
  const [map, countsStr] = line.split(' ')
  const counts = countsStr.split(',').map((n) => parseInt(n))

  return { map, counts }
}
