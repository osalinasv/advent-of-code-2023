import fs from 'node:fs'

const VALIDATE_SAME_DISTANCE_TO_SELF = false

const input = fs.readFileSync(process.argv[2], 'utf8')
const [directions, rawNodes] = input.split('\r\n\r\n')

const map = parseMap(rawNodes)
const startNodes = Array.from(map.keys()).filter((n) => n[2] === 'A')

const traversalCosts = []
for (const start of startNodes) {
  const [steps, end] = traverseUntilZ(start)
  traversalCosts.push(steps)

  if (VALIDATE_SAME_DISTANCE_TO_SELF) {
    const [stepsFromToSelf] = traverseUntilSelf(end)
    if (stepsFromToSelf !== steps) throw new Error('Expected traversal from self to be equal to traversal to self')
  }
}

console.log({ traversalCosts })

let minCost = 1
for (let i = 0; i < traversalCosts.length; i++) {
  minCost = (minCost * traversalCosts[i]) / gcd(minCost, traversalCosts[i])
}

console.log({ minCost })

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

function traverseUntilSelf(start) {
  let node = start
  let steps = 0
  let direction = 0

  while (steps === 0 || node != start) {
    const connections = map.get(node)

    if (directions[direction] === 'L') {
      node = connections.left
    } else {
      node = connections.right
    }

    steps++
    direction = (direction + 1) % directions.length
  }

  return [steps, node]
}

function traverseUntilZ(start) {
  let node = start
  let steps = 0
  let direction = 0

  while (node[2] !== 'Z') {
    const connections = map.get(node)

    if (directions[direction] === 'L') {
      node = connections.left
    } else {
      node = connections.right
    }

    steps++
    direction = (direction + 1) % directions.length
  }

  return [steps, node]
}

function parseMap(nodes) {
  const lines = nodes.split('\r\n')
  const map = new Map()

  for (const line of lines) {
    const node = line.substring(0, 3)
    const connections = line.substring(7, line.length - 1)

    const [left, right] = connections.split(', ')
    map.set(node, { left, right })
  }

  return map
}
