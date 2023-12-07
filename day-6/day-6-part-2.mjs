import fs from 'node:fs'

const input = fs.readFileSync('./input.txt', 'utf8')
const race = parseRace(input)

const total = getWaysToBeatRecord(race.time, race.distance)
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

  return waysToBeatRecord
}

function parseRace(input) {
  const timeStartIndex = input.indexOf(':') + 1
  const timeEndOfLineIndex = input.indexOf('\r\n', timeStartIndex)
  const timeStr = input.substring(timeStartIndex, timeEndOfLineIndex)
  const time = parseInt(timeStr.replace(/\s+/g, ''))

  const distanceStartIndex = input.indexOf(':', timeEndOfLineIndex) + 1
  const distanceStr = input.substring(distanceStartIndex)
  const distance = parseInt(distanceStr.replace(/\s+/g, ''))

  return { time, distance }
}
