import fs from 'node:fs'

const input = fs.readFileSync(process.argv[2], 'utf8')
const [directions, rawNodes] = input.split('\r\n\r\n')

const map = parseMap(rawNodes)
const nodes = Array.from(map.keys())
  .filter((n) => n[2] === 'A')
  .map((n) => ({ start: n, prev: null, current: n }))

const steps = run(nodes)
console.log({ steps })

function run(nodes) {
  let pending = nodes.length
  let steps = 0
  let direction = 0

  // console.log({ nodes, pending })
  let _forceQuit = false

  while (pending > 0) {
    const dir = directions[direction]
    console.log(steps + 1, dir)

    for (const node of nodes) {
      const connections = map.get(node.current)

      node.prev = node.current
      if (dir === 'L') {
        node.current = connections.left
      } else {
        node.current = connections.right
      }

      if (!node.finished && node.current[2] === 'Z') {
        node.finished = true
        pending--
      } else if (node.finished && node.current[2] !== 'Z') {
        node.finished = false
        pending++

        // _forceQuit = true
      }

      console.log(node)
    }

    console.log()
    steps++
    direction = (direction + 1) % directions.length

    // if (_forceQuit) return steps
  }

  return steps
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
