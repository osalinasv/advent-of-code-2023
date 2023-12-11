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

const directions = getStartingDirections(start)
const traversals = directions.map((dir) => ({
  current: [...start],
  direction: dir,
  distance: 0,
}))

let traverse = true
while (traverse) {
  for (const traversal of traversals) {
    traversal.current[0] += traversal.direction[0]
    traversal.current[1] += traversal.direction[1]
    traversal.distance++

    traversal.direction = getNextDirection(traversal.current, traversal.direction)
  }

  traverse = !coordsEqual(traversals[0].current, traversals[1].current)
}

console.log(traversals)

function getNextDirection(coord, incoming) {
  const pipe = map[coord[1]][coord[0]]
  if (pipe === '|' || pipe === '-') return incoming

  const intakes = INTAKE_MASKS.get(pipe)
  for (const intake of intakes) {
    if (!coordsEqual(intake, incoming)) {
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
  const coord = [ref[0] + dir[0], ref[1] + dir[1]]
  if (!isInBounds(coord)) return false

  const pipe = map[coord[1]][coord[0]]
  const intakes = INTAKE_MASKS.get(pipe)
  if (!intakes) return false

  for (const intake of intakes) {
    if (coordsEqual(intake, dir)) {
      return true
    }
  }

  return false
}

function isInBounds(coord) {
  return coord[0] >= 0 && coord[0] < map[0].length && coord[1] >= 0 && coord[1] < map.length
}

function coordsEqual(a, b) {
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
