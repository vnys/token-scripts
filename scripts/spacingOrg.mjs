import { promises as fs } from 'fs'

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

const spacing = [...Array(7).keys()].map(spreadToGrid) // [0, 4, 8, ... 24]

const type = {
  COMPOSITION: 'composition',
}

const verticalSnapped = (density, spacing, typeScale) => ({
  paddingBottom: `({spacing.${spacing}} * 2 + {capHeight.snappedToGrid.${typeScale}} - {lineHeight.${density}.${typeScale}}) / 2`,
  paddingTop: `{spacing.${spacing}} * 2 + {const.grid} * ceil({capHeight.rounded.${typeScale}} / {const.grid}) - {lineHeight.${density}.${typeScale}} - roundTo({spacing.${spacing}} - ({lineHeight.${density}.${typeScale}} - {capHeight.rounded.${typeScale}}) / 2)`,
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
        onGrid: Object.fromEntries(
          spacing.map((horSpace) => [
            `h${horSpace}`,
            Object.fromEntries(
              spacing
                .slice(3, 5)
                .map((vertSpace) => [
                  `v${vertSpace}`,
                  Object.fromEntries(
                    typeScale.map((type) => [
                      `t${type}`,
                      template(density, true, horSpace, vertSpace, type),
                    ]),
                  ),
                ]),
            ),
          ]),
        ),
        offGrid: Object.fromEntries(
          spacing.map((horSpace) => [
            `h${horSpace}`,
            Object.fromEntries(
              spacing.map((vertSpace) => [
                `v${vertSpace}`,
                Object.fromEntries(
                  typeScale.map((type) => [
                    `${type}`,
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
// writeToFile(density.COMPRESSED)
// writeToFile(density.COMFORTABLE)
// writeToFile(density.RELAXED)
