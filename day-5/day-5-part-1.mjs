import fs from 'node:fs'

const input = fs.readFileSync('./input.txt', 'utf8')
const seeds = parseSeeds(input)

const seedToSoil = parseMap(input, 'seed-to-soil')
const soilToFertilizer = parseMap(input, 'soil-to-fertilizer')
const fertilizerToWater = parseMap(input, 'fertilizer-to-water')
const waterToLight = parseMap(input, 'water-to-light')
const lightToTemperature = parseMap(input, 'light-to-temperature')
const temperatureToHumidity = parseMap(input, 'temperature-to-humidity')
const humidityToLocation = parseMap(input, 'humidity-to-location')

let lowestLocation = null

for (const seed of seeds) {
  const soil = seedToSoil(seed)
  const fertilizer = soilToFertilizer(soil)
  const water = fertilizerToWater(fertilizer)
  const light = waterToLight(water)
  const temperature = lightToTemperature(light)
  const humidity = temperatureToHumidity(temperature)
  const location = humidityToLocation(humidity)

  if (lowestLocation === null || location < lowestLocation) {
    lowestLocation = location
  }
}

console.log({ lowestLocation })

function parseSeeds(input) {
  const seedsStr = input.substring(input.indexOf(':') + 2, input.indexOf('\r\n'))
  return seedsStr.split(' ').map((s) => parseInt(s))
}

function parseMap(input, label) {
  const labelIndex = input.indexOf(label)
  if (labelIndex < 0) throw new Error(`Didn't find ${label}`)

  const ranges = []
  const rawRanges = []
  let index = labelIndex + label.length + 7

  while (index < input.length) {
    let endOfLineIndex = input.indexOf('\r\n', index)
    if (endOfLineIndex < 0) endOfLineIndex = input.length

    const rangeStr = input.substring(index, endOfLineIndex)
    if (rangeStr === '') break

    ranges.push(parseRange(rangeStr))
    rawRanges.push(rangeStr)

    index = endOfLineIndex + 2
  }

  return curryMapValue(ranges)
}

function parseRange(line) {
  const [destStart, sourceStart, length] = line.split(' ').map((s) => parseInt(s))

  return {
    destStart,
    sourceStart,
    sourceEnd: sourceStart + length,
  }
}

function curryMapValue(ranges) {
  return (sourceVal) => mapValue(ranges, sourceVal)
}

function mapValue(ranges, sourceVal) {
  for (const range of ranges) {
    if (sourceVal >= range.sourceStart && sourceVal < range.sourceEnd) {
      const sourceOffset = sourceVal - range.sourceStart
      return range.destStart + sourceOffset
    }
  }

  return sourceVal
}
