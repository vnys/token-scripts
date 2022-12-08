# token-scripts

Some build scripts for Figma Tokens

The spacingOrg.mjs script results in a million tokens, so that’s obviously not the way to go. Spacing.mjs is a bit simpler. Read https://gist.github.com/vnys/ac50e8189dcae883a7fb09083fed83fa for an explanation about what’s going on.

The structure of an EDS button is an outer autolayout with only horisontal padding, wrapping an optional left icon, another autolayout with vertical padding and a 4px horisontal padding, and an optional right icon.

These tokens only deal with the inner label autolayout. So if we want a container which has a calculated height of 36px, with a textframe with a font-size of 14px and a line-height of 16px, and we also want the base line to align with the grid lines of the layout grid, first create a textframe and add some text – then choose the token `typography.tight.2` and wrap that in an autolayout with the composite token `core.container.tight.onGrid.verticalPadding12.fs2`. If you now add layout grid with rows every 4px, the base line should sit snugly on the layout grid.

The token sets in the build folder are built with javascript, and should not be edited manually in Figma (read-only for certain sets would be nice 😉).
