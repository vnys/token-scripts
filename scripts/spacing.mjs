import { promises as fs } from 'fs'
import { pipe } from './utils.mjs'

const density = {
  TIGHT: 'tight',
  COMPRESSED: 'compressed',
  COMFORTABLE: 'comfortable',
  RELAXED: 'relaxed',
}

const numOfTypeScaleSteps = 10
const gridResolution = 4

const typeScaleSteps = [...Array(numOfTypeScaleSteps).keys()].map((num) =>
  String(num),
) // ["0", "1", ... "9"]

const spacingSteps = [...Array(6).keys()].map((num) => String(4 + num * 4)) // ["4", "8", ... "24"]

const hPad = (spacing) => `{spacing.${spacing}}`
const vPad = (typeScale) => (density) => (spacing) =>
  `({spacing.${spacing}} * 2 + {capHeight.snappedToGrid.${typeScale}} - {lineHeight.${density}.${typeScale}}) / 2`

//const vPadTight = vPad(density.TIGHT)
const vPadTypeScale = typeScaleSteps.map(vPad) // typeScaleSteps.map((step) => vPad(step))
const vPadTight = vPadTypeScale.map((fn) => fn(density.TIGHT))
//const spacing12 = vPadTightTypeScale.map((fn) => fn(12))

console.log(vPadTight)

const type = {
  COMPOSITION: 'composition',
}

//const vPadTight0 = vPadTight(0)

const snappedToGrid = {}

// spacingSteps.map((space) => (snappedToGrid[space] = {}))

// const snappedToGrid = spacingSteps.reduce((obj, curr, i) => {
//   curr: 'foo'
// }, {})

let data = {
  core: {
    container: {
      [density.TIGHT]: {
        snappedToGrid,
        centered: {},
      },
    },
  },
}

//console.log(pipe(hPad)(16))
//console.log(vPadTight0(12))
//console.log(pipe(hPad, vPadTight0)(16))

async function writeToFile(density) {
  await fs.writeFile(
    `../build/${density}.json`,
    JSON.stringify(data, null, 2),
    {
      encoding: 'utf-8',
    },
  )
}

writeToFile(density.TIGHT)
