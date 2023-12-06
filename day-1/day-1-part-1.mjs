import fs from 'node:fs/promises'

main()

async function main() {
  const inputFile = await fs.open('./input.txt')
  let total = 0

  for await (const line of inputFile.readLines()) {
    const parsed = parseLine(line)
    total += parsed
  }

  console.log('TOTAL:', total)
}

function parseLine(line) {
  let left = 0
  let right = line.length - 1

  let searchLeft = true
  let searchRight = true

  while (left <= right && (searchLeft || searchRight)) {
    if ((searchLeft && line[left] < '0') || line[left] > '9') {
      left++
    } else {
      searchLeft = false
    }

    if ((searchRight && line[right] < '0') || line[right] > '9') {
      right--
    } else {
      searchRight = false
    }
  }

  const digits = line[left] + line[right]
  return parseInt(digits)
}
