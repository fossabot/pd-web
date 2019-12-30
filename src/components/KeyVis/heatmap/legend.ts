import * as d3 from 'd3'
import { ColorScheme } from './color'
import _ from 'lodash'

export default function(colorScheme: ColorScheme) {
  let marginLeft = 70
  let width = 620
  let height = 50
  let innerWidth = width - marginLeft * 2
  let innerHeight = 26
  let tickCount = 5

  let contaiiner = (d3 as any).select('.PD-Cluster-Legend')

  let xScale = (d3 as any)
    .scaleSymlog()
    .domain([colorScheme.maxValue / 1000, colorScheme.maxValue])
    .range([0, innerWidth])

  let canvas = contaiiner.selectAll('canvas').data([null])
  canvas = canvas
    .enter()
    .append('canvas')
    .style('left', marginLeft + 'px')
    .style('position', 'absolute')
    .merge(canvas)
    .attr('width', width)
    .attr('height', height)

  const ctx: CanvasRenderingContext2D = canvas.node().getContext('2d')

  for (let x = 0; x < innerWidth; x++) {
    ctx.fillStyle = colorScheme.backgroud(xScale.invert(x)).toString()
    ctx.fillRect(x, 0, 1, innerHeight)
  }

  let xAxis = d3
    .axisBottom(xScale)
    .ticks(10)
    .tickValues(_.range(0, tickCount + 1).map(d => xScale.invert((innerWidth * d) / tickCount)))
    .tickSize(innerHeight)

  let svg = contaiiner.selectAll('svg').data([null])
  svg = svg
    .enter()
    .append('svg')
    .style('position', 'absolute')
    .merge(svg)
    .attr('width', width)
    .attr('height', height)

  let xAxisG = svg.selectAll('g').data([null])
  xAxisG = xAxisG
    .enter()
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ', 0)')
    .merge(xAxisG)
    .call(xAxis)
    .call(g => {
      g.selectAll('.tick text').attr('y', innerHeight + 6)
      g.selectAll('.domain').remove()
    })
}
