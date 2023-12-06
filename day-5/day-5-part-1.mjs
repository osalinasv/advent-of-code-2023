import fs from 'node:fs'

const LOG_ENABLED = false

const input = fs.readFileSync('./input.txt', 'utf8')

const seeds = parseSeeds(input)
log({ seeds }, '\n')

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

  log({ label, rawRanges, ranges }, '\n')
  return curryMapValue(ranges)
}

function parseRange(line) {
  const [destStart, sourceMin, length] = line.split(' ').map((s) => parseInt(s))

  return {
    length,
    destStart,
    sourceMin,
    sourceMax: sourceMin + length - 1,
  }
}

function curryMapValue(ranges) {
  const memo = new Map()
  return (sourceVal) => memoMapValue(ranges, sourceVal, memo)
}

function memoMapValue(ranges, sourceVal, memo) {
  if (memo.has(sourceVal)) return memo.get(sourceVal)

  const mapped = mapValue(ranges, sourceVal)
  memo.set(sourceVal, mapped)

  return mapped
}

function mapValue(ranges, sourceVal) {
  for (const range of ranges) {
    if (sourceVal >= range.sourceMin && sourceVal <= range.sourceMax) {
      const sourceOffset = sourceVal - range.sourceMin
      return range.destStart + sourceOffset
    }
  }

  return sourceVal
}

function log(...args) {
  if (!LOG_ENABLED) return
  console.log(...args)
}
