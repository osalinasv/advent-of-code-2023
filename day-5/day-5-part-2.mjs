import fs from 'node:fs'

const input = fs.readFileSync('./input.txt', 'utf8')
const seedRanges = parseSeedRanges(input)

const seedToSoilRanges = parseRanges(input, 'seed-to-soil')
const soilToFertilizerRanges = parseRanges(input, 'soil-to-fertilizer')
const fertilizerToWaterRanges = parseRanges(input, 'fertilizer-to-water')
const waterToLightRanges = parseRanges(input, 'water-to-light')
const lightToTemperatureRanges = parseRanges(input, 'light-to-temperature')
const temperatureToHumidityRanges = parseRanges(input, 'temperature-to-humidity')
const humidityToLocationRanges = parseRanges(input, 'humidity-to-location')

let lowestLocation = null

for (const seedRange of seedRanges) {
  let ranges = [seedRange]

  ranges = mapRanges(ranges, seedToSoilRanges)
  ranges = mapRanges(ranges, soilToFertilizerRanges)
  ranges = mapRanges(ranges, fertilizerToWaterRanges)
  ranges = mapRanges(ranges, waterToLightRanges)
  ranges = mapRanges(ranges, lightToTemperatureRanges)
  ranges = mapRanges(ranges, temperatureToHumidityRanges)
  ranges = mapRanges(ranges, humidityToLocationRanges)

  for (const range of ranges) {
    if (lowestLocation === null || range.start < lowestLocation) {
      lowestLocation = range.start
    }
  }
}

console.log({ lowestLocation })

function mapRanges(sourceRanges, mappingRanges) {
  const mappedRanges = []
  let otherRanges = sourceRanges

  for (const mappingRange of mappingRanges) {
    const segmentedRanges = []

    while (otherRanges.length > 0) {
      const { start, end } = otherRanges.pop()

      const before = { start: start, end: Math.min(end, mappingRange.sourceStart) }
      const inter = { start: Math.max(start, mappingRange.sourceStart), end: Math.min(mappingRange.sourceEnd, end) }
      const after = { start: Math.max(mappingRange.sourceEnd, start), end: end }

      if (before.end > before.start) {
        segmentedRanges.push(before)
      }

      if (inter.end > inter.start) {
        mappedRanges.push({
          start: inter.start - mappingRange.sourceStart + mappingRange.destStart,
          end: inter.end - mappingRange.sourceStart + mappingRange.destStart,
        })
      }

      if (after.end > after.start) {
        segmentedRanges.push(after)
      }
    }

    otherRanges = segmentedRanges
  }

  return mappedRanges.concat(otherRanges)
}

function parseSeedRanges(input) {
  const seedsStr = input.substring(input.indexOf(':') + 2, input.indexOf('\r\n'))
  const seedVals = seedsStr.split(' ').map((s) => parseInt(s))

  if (seedVals.length % 2 !== 0) {
    throw new Error('Seed ranges not in pairs')
  }

  const ranges = []
  for (let index = 0; index < seedVals.length - 1; index += 2) {
    const start = seedVals[index]
    const length = seedVals[index + 1]

    ranges.push({
      start,
      end: start + length,
    })
  }

  return ranges
}

function parseRanges(input, label) {
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

  return ranges
}

function parseRange(line) {
  const [destStart, sourceStart, length] = line.split(' ').map((s) => parseInt(s))

  return {
    destStart,
    sourceStart,
    sourceEnd: sourceStart + length,
  }
}
