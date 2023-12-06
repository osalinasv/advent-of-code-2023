import fs from 'node:fs/promises'
import { parseGame } from './common.mjs'

main()

async function main() {
  const inputFile = await fs.open('./input.txt')
  let idSum = 0

  const cubes = {
    red: 12,
    green: 13,
    blue: 14,
  }

  for await (const line of inputFile.readLines()) {
    const game = parseGame(line)

    if (checkGameIsPossible(game, cubes)) {
      idSum += game.id
    }
  }

  console.log('ID TOTAL:', idSum)
}

function checkGameIsPossible(game, cubes) {
  return (
    game.maximums.red &&
    game.maximums.red <= cubes.red &&
    game.maximums.green &&
    game.maximums.green <= cubes.green &&
    game.maximums.blue &&
    game.maximums.blue <= cubes.blue
  )
}
