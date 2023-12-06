import fs from 'node:fs/promises'
import { parseGame } from './common.mjs'

main()

async function main() {
  const inputFile = await fs.open('./input.txt')
  let powerSum = 0

  for await (const line of inputFile.readLines()) {
    const game = parseGame(line)
    powerSum += getGamePower(game.maximums)
  }

  console.log('POWER TOTAL:', powerSum)
}

function getGamePower(cubes) {
  return cubes.red * cubes.green * cubes.blue
}
