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

const typeScale = [...Array(numOfTypeScaleSteps).keys()] // [0, 1, ... 9]

const bumpOneGridStep = (num) => num + gridResolution
const spreadToGrid = (num) => num * gridResolution

/**
 * @returns {Number}
 */
const spacing = [...Array(6).keys()].map((num) =>
  pipe(spreadToGrid, bumpOneGridStep)(num),
) // [4, 8, ... 24]

const type = {
  COMPOSITION: 'composition',
}

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
})

const data = (density) => ({
  core: {
    container: {
      [density]: {
        snappedToGrid: Object.fromEntries(
          spacing
            //.slice(0, 3)
            .map((horSpace) => [
              `horisontal${horSpace}`,
              Object.fromEntries(
                spacing.map((vertSpace) => [
                  `vertical${vertSpace}`,
                  Object.fromEntries(
                    typeScale.map((type) => [
                      `typeScale${type}`,
                      template(density, true, horSpace, vertSpace, type),
                    ]),
                  ),
                ]),
              ),
            ]),
        ),
        centered: Object.fromEntries(
          spacing
            //.slice(0, 3)
            .map((horSpace) => [
              `horisontal${horSpace}`,
              Object.fromEntries(
                spacing.map((vertSpace) => [
                  `vertical${vertSpace}`,
                  Object.fromEntries(
                    typeScale.map((type) => [
                      `typeScale${type}`,
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
writeToFile(density.COMFORTABLE)
writeToFile(density.RELAXED)
