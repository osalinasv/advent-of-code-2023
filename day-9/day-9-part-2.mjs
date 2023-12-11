import fs from 'node:fs'

const input = fs.readFileSync(process.argv[2], 'utf8')
const sequences = input.split('\r\n').map((line) => line.split(' ').map((n) => parseInt(n)))

let total = 0
for (const sequence of sequences) {
  const prediction = predictNext(sequence)
  total += prediction
}

console.log({ total })

function predictNext(sequence) {
  const steps = [sequence]
  let step = sequence

  while (true) {
    const [diffs, zeroes] = getDiffs(step)
    if (zeroes) break

    step = diffs
    steps.push(step)
  }

  let stepIndex = steps.length - 1
  let prediction = NaN

  while (stepIndex >= 0) {
    const currentStep = steps[stepIndex]
    const nextStep = steps[stepIndex + 1]

    let extend = currentStep[0]
    if (nextStep) extend -= nextStep[0]

    currentStep.unshift(extend)
    stepIndex--

    prediction = extend
  }

  return prediction
}

function getDiffs(sequence) {
  const diffs = []
  let zeroes = 0

  for (let index = 0; index < sequence.length - 1; index++) {
    const diff = sequence[index + 1] - sequence[index]
    if (diff === 0) zeroes++

    diffs.push(diff)
  }

  return [diffs, zeroes === diffs.length]
}
