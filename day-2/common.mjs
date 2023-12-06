export function parseGame(line) {
  const endOfHeader = line.indexOf(':')

  const gameIdString = line.substring(line.indexOf(' ') + 1, endOfHeader)
  const id = parseInt(gameIdString)

  const roundsString = line.substring(endOfHeader + 2)
  const rounds = roundsString.split('; ').map(parseRound)

  const maximums = {
    red: 0,
    green: 0,
    blue: 0,
  }

  for (const round of rounds) {
    maximums.red = round.red && round.red > maximums.red ? round.red : maximums.red
    maximums.green = round.green && round.green > maximums.green ? round.green : maximums.green
    maximums.blue = round.blue && round.blue > maximums.blue ? round.blue : maximums.blue
  }

  return { id, rounds, maximums }
}

export function parseRound(line) {
  const pullStrings = line.split(', ')
  const round = {}

  for (const pullString of pullStrings) {
    const [amount, color] = pullString.split(' ')
    round[color] = parseInt(amount)
  }

  return round
}
