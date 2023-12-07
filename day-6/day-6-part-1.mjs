import fs from 'node:fs'

// const input = fs.readFileSync('./sample.txt', 'utf8')
const input = fs.readFileSync('./input.txt', 'utf8')
const races = parseRaces(input)

let total = 1
for (const race of races) {
  total *= getWaysToBeatRecord(race.time, race.distance)
}

console.log({ total })

function getWaysToBeatRecord(time, record) {
  let waysToBeatRecord = 0

  for (let timeHeld = 1; timeHeld < time; timeHeld++) {
    const timeLeft = time - timeHeld
    const distanceTraveled = timeLeft * timeHeld

    if (distanceTraveled > record) {
      waysToBeatRecord++
    }
  }

  console.log({ time, record, waysToBeatRecord })
  return waysToBeatRecord
}

function parseRaces(input) {
  const timesStartIndex = input.indexOf(':') + 1
  const timesEndOfLineIndex = input.indexOf('\r\n', timesStartIndex)
  const timesStr = input.substring(timesStartIndex, timesEndOfLineIndex)
  const times = timesStr
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n))

  const distancesStartIndex = input.indexOf(':', timesEndOfLineIndex) + 1
  const distancesStr = input.substring(distancesStartIndex)
  const distances = distancesStr
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n))

  if (times.length !== distances.length) {
    throw new Error('Different races data length')
  }

  const races = []
  for (let index = 0; index < times.length; index++) {
    races.push({ time: times[index], distance: distances[index] })
  }

  console.log({ races })
  return races
}
