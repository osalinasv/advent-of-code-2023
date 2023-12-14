import fs from 'node:fs'

const input = fs.readFileSync(process.argv[2], 'utf8')
const records = parseRecords(input)

let total = 0
for (const record of records) {
  const [split, type] = findSplit(record)
  total += type === 'V' ? split + 1 : 100 * (split + 1)
}

console.log({ total })

function findSplit(map) {
  const hMirrors = findSplits(map)
  if (hMirrors.length === 1) return [hMirrors[0], 'H']

  const vMirror = findVerticalSplit(map)
  if (vMirror > -1) return [vMirror, 'V']

  return null
}

function findVerticalSplit(map) {
  const splitCols = findSplits(map[0])

  for (const splitCol of splitCols) {
    if (splitMirrorsAll(map, 1, splitCol)) {
      return splitCol
    }
  }

  return -1
}

function splitMirrorsAll(map, from, col) {
  for (let index = from; index < map.length; index++) {
    if (!splitMirrors(map[index], col)) {
      return false
    }
  }

  return true
}

function findSplits(items) {
  const splits = []

  for (let split = 0; split < items.length - 1; split++) {
    if (splitMirrors(items, split)) {
      splits.push(split)
    }
  }

  return splits
}

function splitMirrors(items, splitAt) {
  let left = splitAt
  let right = splitAt + 1

  while (left >= 0 && right < items.length) {
    if (items[left] !== items[right]) {
      return false
    }

    left--
    right++
  }

  return true
}

function parseRecords(input) {
  return input.split('\r\n\r\n').map((m) => m.split('\r\n'))
}
