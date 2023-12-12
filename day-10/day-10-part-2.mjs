import fs from 'node:fs'

// prettier-ignore
const INTAKE_MASKS = new Map([
  ['|', [[0, 1], [0, -1]]],
  ['-', [[1, 0], [-1, 0]]],
  ['L', [[0, 1], [-1, 0]]],
  ['J', [[0, 1], [1, 0]]],
  ['7', [[0, -1], [1, 0]]],
  ['F', [[0, -1], [-1, 0]]],
])

const input = fs.readFileSync(process.argv[2], 'utf8')
const [map, start] = parseMap(input)

const sDir = getStartingDirections(start)[parseInt(process.argv[3] || 1)]
const [vertices, perimeter] = getVertices(start, sDir)

const tiles = countTiles(vertices)
console.log({ tiles, enclosed: tiles - perimeter })

function countTiles(vertices) {
  let minX = Number.MAX_VALUE
  let maxX = 0

  let minY = Number.MAX_VALUE
  let maxY = 0

  for (const [x, y] of vertices) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x

    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  let tiles = 0
  for (let row = minY; row <= maxY; row++) {
    for (let col = minX; col <= maxX; col++) {
      if (relationPP(vertices, [col, row]) != -1) tiles++
    }
  }

  return tiles
}

// https://stackoverflow.com/a/63436180
// @returns -1: outside, 0: on edge, 1: inside
function relationPP(vertices, point) {
  const between = (p, a, b) => (p >= a && p <= b) || (p <= a && p >= b)
  let inside = false

  for (let i = vertices.length - 1, j = 0; j < vertices.length; i = j, j++) {
    const A = vertices[i]
    const B = vertices[j]
    // corner cases
    if ((point[0] == A[0] && point[1] == A[1]) || (point[0] == B[0] && point[1] == B[1])) return 0
    if (A[1] == B[1] && point[1] == A[1] && between(point[0], A[0], B[0])) return 0

    if (between(point[1], A[1], B[1])) {
      // if P inside the vertical range
      // filter out "ray pass vertex" problem by treating the line a little lower
      if ((point[1] == A[1] && B[1] >= A[1]) || (point[1] == B[1] && A[1] >= B[1])) continue
      // calc cross product `PA X PB`, P lays on left side of AB if c > 0
      const c = (A[0] - point[0]) * (B[1] - point[1]) - (B[0] - point[0]) * (A[1] - point[1])
      if (c == 0) return 0
      if (A[1] < B[1] == c > 0) inside = !inside
    }
  }

  return inside ? 1 : -1
}

function getVertices(start, dir) {
  const vertices = [start]

  let tiles = 1
  let direction = dir
  let current = [start[0] + dir[0], start[1] + dir[1]]

  while (!pointsEqual(start, current)) {
    const newDir = getNextDirection(current, direction)
    if (pointsEqual(direction, newDir)) {
      current[0] += newDir[0]
      current[1] += newDir[1]
    } else {
      vertices.push(current)
      current = [current[0] + newDir[0], current[1] + newDir[1]]
    }

    tiles++
    direction = newDir
  }

  return [vertices, tiles]
}

function getNextDirection(point, incoming) {
  const pipe = map[point[1]][point[0]]
  if (pipe === '|' || pipe === '-') return incoming

  const intakes = INTAKE_MASKS.get(pipe)
  for (const intake of intakes) {
    if (!pointsEqual(intake, incoming)) {
      return [-intake[0], -intake[1]]
    }
  }

  throw new Error("Didn't find a direction")
}

function getStartingDirections(start) {
  const directions = []

  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]

  for (const dir of dirs) {
    if (canIntakeFrom(start, dir)) {
      directions.push(dir)
    }
  }

  return directions
}

function canIntakeFrom(ref, dir) {
  const point = [ref[0] + dir[0], ref[1] + dir[1]]
  if (!isInBounds(point)) return false

  const pipe = map[point[1]][point[0]]
  const intakes = INTAKE_MASKS.get(pipe)
  if (!intakes) return false

  for (const intake of intakes) {
    if (pointsEqual(intake, dir)) {
      return true
    }
  }

  return false
}

function isInBounds(point) {
  return point[0] >= 0 && point[0] < map[0].length && point[1] >= 0 && point[1] < map.length
}

function pointsEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1]
}

function parseMap(input) {
  const rows = []
  const lines = input.split('\r\n')
  let start = null

  for (let index = 0; index < lines.length; index++) {
    const [columns, startX] = parseRow(lines[index])
    if (startX >= 0) start = [startX, index]

    rows.push(columns)
  }

  if (start == null) {
    throw new Error("Didn't find start point")
  }

  return [rows, start]
}

function parseRow(line) {
  const columns = []
  let startX = -1

  for (let index = 0; index < line.length; index++) {
    columns.push(line[index])
    if (line[index] === 'S') startX = index
  }

  return [columns, startX]
}
