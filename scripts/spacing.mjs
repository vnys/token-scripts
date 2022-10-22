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

const typeScale = [...Array(numOfTypeScaleSteps).keys()]

//.map((num) => String(num),) // ["0", "1", ... "9"]

const add4 = (num) => num + 4
const quadruple = (num) => num * 4

/**
 * @returns {[]}
 */
const spacing = [...Array(6).keys()].map((num) => pipe(quadruple, add4)(num)) // ["4", "8", ... "24"]

const hPad = (spacing) => `{spacing.${spacing}}`
const vPad = (typeScale) => (density) => (spacing) =>
  `({spacing.${spacing}} * 2 + {capHeight.snappedToGrid.${typeScale}} - {lineHeight.${density}.${typeScale}}) / 2`

//const vPadTight = vPad(density.TIGHT)
const vPadTypeScale = typeScale.map(vPad) // typeScale.map((step) => vPad(step))
const vPadTight = vPadTypeScale.map((fn) => fn(density.TIGHT))
//const spacing12 = vPadTightTypeScale.map((fn) => fn(12))

const spacingStep = (spacing) => ({
  horisontalPadding: hPad(spacing),
  //  verticalPadding:
})

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

/**
@param {density} density
@param {typeof <spacing>} spacing
*/
const verticalSnapped = (density, spacing, typeScale) => ({
  paddingBottom: `({spacing.${spacing}} * 2 + {capHeight.snappedToGrid.${typeScale}} - {lineHeight.${density}.${typeScale}}) / 2`,
  paddingTop: `{spacing.${spacing}} * 2 + {grid.base} * ceil({capHeight.rounded.${typeScale}} / {grid.base}) - {lineHeight.${density}.${typeScale}} - roundTo({spacing.${spacing}} - ({lineHeight.${density}.${typeScale}} - {capHeight.rounded.${typeScale}}) / 2)`,
})

const verticalCentered = (density, spacing, typeScale) => ({
  verticalPadding: `({spacing.${spacing}} * 2 + {capHeight.snappedToGrid.${typeScale}} - {lineHeight.${density}.${typeScale}}) / 2`,
})

const template = (density, snapped, horSpace, vertSpace, typeScale) => ({
  value: {
    horisontalPadding: `{spacing.${horSpace}}`,
    ...(snapped
      ? verticalSnapped(density, vertSpace, typeScale)
      : verticalCentered(density, vertSpace, typeScale)),
    typography: `{typography.${density}.${typeScale}}`,
  },
  type: type.COMPOSITION,
  descpription: `Horisontal spacing: ${horSpace}`,
})

const data = (density) => ({
  core: {
    container: {
      [density]: {
        snappedToGrid: Object.fromEntries(
          spacing.map((horSpace) => [
            horSpace,
            Object.fromEntries(
              spacing.map((vertSpace) => [
                vertSpace,
                Object.fromEntries(
                  typeScale.map((type) => [
                    type,
                    template(density, true, horSpace, vertSpace, type),
                  ]),
                ),
              ]),
            ),
          ]),
        ),
        centered: Object.fromEntries(
          spacing.map((horSpace) => [
            horSpace,
            Object.fromEntries(
              spacing.map((vertSpace) => [
                vertSpace,
                Object.fromEntries(
                  typeScale.map((type) => [
                    type,
                    template(density, false, horSpace, vertSpace, type),
                  ]),
                ),
              ]),
            ),
          ]),
        ),
      },
    },
  },
})

async function writeToFile(density) {
  await fs.writeFile(
    `../build/${density}.json`,
    JSON.stringify(data(density), null, 2),
    {
      encoding: 'utf-8',
    },
  )
}

writeToFile(density.TIGHT)
writeToFile(density.COMPRESSED)
