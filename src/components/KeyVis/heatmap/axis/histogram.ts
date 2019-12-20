import * as d3 from 'd3'
import { Section, scaleSections } from '.'

const xHeight = 30
const yWidth = 30
const fill = '#333'
const stroke = '#fff'

export function histogram(data: number[][]) {
  let xRange: [number, number] = [0, 0]
  let yRange: [number, number] = [0, 0]

  histogram.xRange = function(val: [number, number]) {
    xRange = val
    return this
  }

  histogram.yRange = function(val: [number, number]) {
    yRange = val
    return this
  }

  function histogram(xG, yG, xScale, yScale) {
    const xLen = data.length
    const yLen = data[0].length

    const xStartIdx = Math.max(0, Math.floor(xScale.invert(xRange[0])))
    const xEndIdx = Math.min(xLen - 1, Math.ceil(xScale.invert(xRange[1])))
    const yStartIdx = Math.max(0, Math.floor(yScale.invert(yRange[0])))
    const yEndIdx = Math.min(yLen - 1, Math.ceil(yScale.invert(yRange[1])))

    const xSum: Section<number, number>[] = []
    const ySum: Section<number, number>[] = []

    for (let x = xStartIdx; x < xEndIdx; x++) {
      let sumVal = 0
      for (let y = yStartIdx; y < yEndIdx; y++) {
        sumVal += data[x][y]
      }
      xSum.push({ val: sumVal, start: x, end: x + 1 })
    }
    for (let y = yStartIdx; y < yEndIdx; y++) {
      let sumVal = 0
      for (let x = xStartIdx; x < xEndIdx; x++) {
        sumVal += data[x][y]
      }
      ySum.push({ val: sumVal, start: y, end: y + 1 })
    }

    const xBins = scaleSections(xSum, xRange, xScale, (origin, val) => origin + val)
    const yBins = scaleSections(ySum, yRange, yScale, (origin, val) => origin + val)

    const xBinsMax = d3.max(xBins, section => section.val)!
    const yBinsMax = d3.max(yBins, section => section.val)!

    let xRect = xG.selectAll('rect').data(xBins)
    xRect.exit().remove()
    xRect = xRect
      .enter()
      .append('rect')
      .attr('stroke', stroke)
      .attr('fill', fill)
      .merge(xRect)
      .attr('x', d => d.start)
      .attr('y', d => xHeight - (xHeight * d.val) / xBinsMax)
      .attr('width', d => d.end - d.start)
      .attr('height', d => (xHeight * d.val) / xBinsMax)

    let yRect = yG.selectAll('rect').data(yBins)
    yRect.exit().remove()
    yRect = yRect
      .enter()
      .append('rect')
      .attr('stroke', stroke)
      .attr('fill', fill)
      .merge(yRect)
      .attr('x', d => yWidth - (yWidth * d.val) / yBinsMax)
      .attr('y', d => d.start)
      .attr('width', d => (yWidth * d.val) / yBinsMax)
      .attr('height', d => d.end - d.start)
  }

  return histogram
}
