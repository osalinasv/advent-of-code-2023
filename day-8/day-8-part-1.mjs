import fs from 'node:fs'

const input = fs.readFileSync(process.argv[2], 'utf8')
const [directions, rawNodes] = input.split('\r\n\r\n')

const map = parseMap(rawNodes)

let node = 'AAA'
let steps = 0
let direction = 0

while (node !== 'ZZZ') {
  const connections = map.get(node)

  if (directions[direction] === 'L') {
    node = connections.left
  } else {
    node = connections.right
  }

  steps++
  direction = (direction + 1) % directions.length
}

console.log({ steps })

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
