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
  '#171717',
  '#181818',
  '#191919',
  '#410c74',
  '#72067b',
  '#b00f53',
  '#fcc734',
  '#fbfc43',
  '#ffffb0'
])

export type ColorScale = (val: number) => d3.RGBColor
export type ColorScheme = {
  backgroud: ColorScale
  label: ColorScale
  maxValue: number
}

export function getColorScheme(maxValue: number, brightness: number): ColorScheme {
  const logScale = (d3 as any).scaleSymlog().domain([0, maxValue / brightness])
  const backgroudColorScale = (d: number) => d3.color(heatmapColor(logScale(d)))! as d3.RGBColor
  const labelColorScale = (d: number) =>
    d3.hsl(backgroudColorScale(d)).l > 0.5 ? (d3.color('black')! as d3.RGBColor) : (d3.color('white')! as d3.RGBColor)

  return {
    backgroud: backgroudColorScale,
    label: labelColorScale,
    maxValue: maxValue
  }
}
