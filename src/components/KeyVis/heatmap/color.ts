import * as d3 from 'd3'

const heatmapColor = d3.interpolateRgbBasis([
  '#000000',
  '#080808',
  '#090909',
  '#101010',
  '#111111',
  '#121212',
  '#131313',
  '#141414',
  '#151515',
  '#202020',
  '#410c74',
  '#72067b',
  '#b00f53',
  '#fcc734',
  '#fbfc43',
  '#ffffb0'
])

export type ColorScale = (n: number) => d3.RGBColor | d3.HSLColor
export type ColorScheme = {
  backgroud: ColorScale
  label: ColorScale
}

export function getColorScheme(maxValue: number, brightness: number): ColorScheme {
  const logScale = (d3 as any).scaleSymlog().domain([0, maxValue / brightness])
  const backgroudColorScale = (d: number) => d3.color(heatmapColor(logScale(d)))!
  const labelColorScale = (d: number) =>
    d3.hsl(backgroudColorScale(d)).l > 0.5 ? d3.color('black')! : d3.color('white')!

  return {
    backgroud: backgroudColorScale,
    label: labelColorScale
  }
}
