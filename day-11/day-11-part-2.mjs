import fs from 'node:fs'

class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

const input = fs.readFileSync(process.argv[2], 'utf8')
const info = parseMap(input)
const pairs = generatePairs(info.galaxies)

let distSum = 0
for (const [a, b] of pairs) {
  const distance = getDistance(a, b, info.emptyCols, info.emptyRows)
  distSum += distance
}

console.log({ distSum })

function getDistance(a, b, emptyCols, emptyRows) {
  let distance = Math.abs(b.x - a.x) + Math.abs(b.y - a.y)

  const minX = Math.min(a.x, b.x)
  const maxX = Math.max(a.x, b.x)
  for (const col of emptyCols) {
    if (col > minX && col < maxX) {
      distance += 999_999
    }
  }

  const minY = Math.min(a.y, b.y)
  const maxY = Math.max(a.y, b.y)
  for (const col of emptyRows) {
    if (col > minY && col < maxY) {
      distance += 999_999
    }
  }

  return distance
}

function generatePairs(items) {
  const pairs = []

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]])
    }
  }

  return pairs
}

function parseMap(input) {
  const map = []
  const galaxies = []

  const emptyRows = new Set()
  const colMap = new Map()

  const lines = input.split('\r\n')

  for (let r = 0; r < lines.length; r++) {
    const row = lines[r].split('')
    map.push(row)

    let gCount = 0
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '#') {
        galaxies.push(new Vec2(c, r))

        colMap.set(c, (colMap.get(c) ?? 0) + 1)
        gCount++
      }
    }

    if (gCount === 0) {
      emptyRows.add(r)
    }
  }

  const emptyCols = new Set()
  for (let c = 0; c < map[0].length; c++) {
    if (!colMap.get(c)) {
      emptyCols.add(c)
    }
  }

  return {
    map,
    galaxies,
    emptyRows,
    emptyCols,
  }
}
