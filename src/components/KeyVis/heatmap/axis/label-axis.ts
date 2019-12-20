import * as d3 from 'd3'
import { Section, scaleSections } from '.'
import { KeyAxisEntry } from '..'
import { truncateString } from '../utils'
import _ from 'lodash'

const labelAxisMargin = 4
const labelAxisWidth = 28
const labelTextPadding = 4
const minTextHeight = 17
const fill = '#333'
const stroke = '#fff'

type Label<U> = Section<string, U>

export function labelAxisGroup(keyAxis: KeyAxisEntry[]) {
  let scale = d3.scaleIdentity()
  let range: [number, number] = [0, 0]
  const groups = aggrKeyAxisLabel(keyAxis)

  const labelAxisGroup = selection => {
    let scaledGroups = groups.map(group => scaleSections(group, range, scale, () => ''))

    const g = selection.selectAll('g').data(scaledGroups)

    g.enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * (labelAxisWidth + labelAxisMargin)}, 0)`)
      .merge(g)
      .call(labelAxis)

    g.exit().remove()
  }

  labelAxisGroup.scale = function(val) {
    scale = val
    return this
  }

  labelAxisGroup.range = function(val) {
    range = val
    return this
  }

  return labelAxisGroup
}

function labelAxis(selection) {
  const rects = selection.selectAll('rect').data(d => {
    return d
  })
  const texts = selection.selectAll('text').data(d => d)

  rects
    .enter()
    .append('rect')
    .attr('width', labelAxisWidth)
    .attr('x', 0)
    .attr('stroke', stroke)
    .merge(rects)
    .attr('fill', fill)
    .attr('y', label => label.start)
    .attr('height', label => label.end - label.start)

  rects.exit().remove()

  texts
    .enter()
    .append('text')
    .attr('fill', 'white')
    .attr('writing-mode', 'tb')
    .attr('font-size', '12')
    .attr('font-weight', '500')
    .merge(texts)
    .attr('transform', label => `translate(${labelAxisWidth / 2}, ${label.end - labelTextPadding}) rotate(180)`)
    .text(label => fitLabelText(label))
    .style('display', label => (shouleHideLabel(label) ? 'none' : ''))

  texts.exit().remove()
}

function shouleHideLabel(label: Label<number>): boolean {
  return label.end - label.start < minTextHeight || label.val?.length === 0
}

function fitLabelText(label: Label<number>): string {
  const rectWidth = label.end - label.start
  const textLen = Math.floor(rectWidth / 7.5)
  return truncateString(label.val, textLen)
}

function aggrKeyAxisLabel(keyAxis: KeyAxisEntry[]): Label<number>[][] {
  let result: Label<number>[][] = _.times(4, () => [])

  for (let groupIdx = 0; groupIdx < result.length; groupIdx++) {
    let lastLabel: string | null = null
    let startKeyIdx: number | null = null

    for (let keyIdx = 0; keyIdx < keyAxis.length; keyIdx++) {
      const label = keyAxis[keyIdx].labels[groupIdx]

      if (label != lastLabel) {
        if (startKeyIdx != null && lastLabel != null) {
          result[groupIdx].push({
            val: lastLabel,
            start: startKeyIdx,
            end: keyIdx,
            idx: startKeyIdx
          })
          startKeyIdx = null
        }

        if (label != null) {
          startKeyIdx = keyIdx
        }
      }

      lastLabel = label
    }
  }

  return result
}
