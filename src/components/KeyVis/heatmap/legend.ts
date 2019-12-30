// @ts-nocheck

import * as d3 from 'd3'

export default function(xdata) {
  if (!xdata.length) return
  if (typeof xdata[0].color === 'string') return
  var data = xdata.map((d, idx) => {
    d.color = d.backgroud.formatHex()
    delete d.backgroud
    d.idx = idx
    return d
  })
  var extent = d3.extent(data, d => d.val)

  var padding = 29
  var width = 620
  var innerWidth = width - padding * 2
  var barHeight = 18
  var height = 48

  var xScale = d3
    .scaleSymlog()
    .range([0, innerWidth])
    .domain(extent)

  var xAxis = d3.axisBottom().scale(xScale)
  xAxis
    .tickValues(data.map(i => i.val))
    .tickFormat(d => d)
    .tickSize([20])

  var svg = d3
    .select('.PD-Cluster-Legend')
    .html('')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  var g = svg.append('g').attr('transform', 'translate(' + padding + ', 0)')

  var defs = svg.append('defs')
  var linearGradient = defs.append('linearGradient').attr('id', 'myGradient')
  linearGradient
    .selectAll('stop')
    .data(data)
    .enter()
    .append('stop')
    .attr('offset', d => d.idx * 0.16 * 100 + '%')
    .attr('stop-color', d => d.color)

  g.append('rect')
    .attr('width', innerWidth)
    .attr('height', barHeight)
    .style('fill', 'url(#myGradient)')

  g.append('g')
    .attr('transform', 'translate(0,0)')
    .call(xAxis)
    .select('.domain')
    .remove()
}
