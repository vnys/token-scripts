import { promises as fs } from 'fs'

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
const vPad = (density) => (spacing) => (typeScale) =>
  `({spacing.${spacing}} * 2 + {capHeight.snappedToGrid.${typeScale}} - {lineHeight.${density}.${typeScale}}) / 2`

const type = {
  COMPOSITION: 'composition',
}

const vPadTight = vPad(density.TIGHT)

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
