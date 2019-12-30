import * as d3 from 'd3'
import { ColorScale } from './color'
import { doEventsOnYield } from './utils'

export async function createBuffer(values: number[][], colorScale: ColorScale): Promise<HTMLCanvasElement> {
  const valueWidth = values.length
  const valueHeight = values[0].length

  const canvas = d3
    .create('canvas')
    .attr('width', valueWidth)
    .attr('height', valueHeight)
    .node() as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const sourceImageData = ctx.createImageData(valueWidth, valueHeight)
  const imageData = sourceImageData.data

  await doEventsOnYield(function*() {
    for (let i = 0; i < imageData.length; i += 4) {
      if (i % (4 * 10000) === 0) yield

      const pixel = i / 4
      const x = pixel % valueWidth
      const y = Math.floor(pixel / valueWidth)

      let color = d3.color(colorScale(values[x][y]))

      if (color) {
        color = color.rgb()
        imageData[i] = color.r
        imageData[i + 1] = color.g
        imageData[i + 2] = color.b
        imageData[i + 3] = 255 // Alpha
      } else {
        continue
      }
    }
  })

  ctx.putImageData(sourceImageData, 0, 0)

  return canvas
}
