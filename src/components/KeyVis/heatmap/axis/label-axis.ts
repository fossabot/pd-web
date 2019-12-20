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
const textFill = 'white'
const stroke = '#fff'

type Label<U> = Section<string, U>

export function labelAxisGroup(keyAxis: KeyAxisEntry[]) {
  let range: [number, number] = [0, 0]
  const groups = aggrKeyAxisLabel(keyAxis)

  labelAxisGroup.range = function(val) {
    range = val
    return this
  }

  function labelAxisGroup(ctx: CanvasRenderingContext2D, scale: (n: number) => number) {
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    let scaledGroups = groups.map(group => scaleSections(group, range, scale, () => ''))

    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.font = '500 12px Poppins'
    ctx.textBaseline = 'middle'
    for (const [groupIdx, group] of scaledGroups.entries()) {
      const marginLeft = groupIdx * (labelAxisWidth + labelAxisMargin)

      for (const label of group) {
        const width = labelAxisWidth
        const height = label.end - label.start

        ctx.fillStyle = fill
        ctx.beginPath()
        ctx.rect(marginLeft, label.start, width, height)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        if (shouleShowLabelText(label)) {
          ctx.fillStyle = textFill
          ctx.translate(marginLeft + labelAxisWidth / 2 + 2, label.end - labelTextPadding)
          ctx.rotate(-Math.PI / 2)
          ctx.fillText(fitLabelText(label), 0, 0)
          ctx.setTransform(1, 0, 0, 1, 0, 0)
        }
      }
    }
  }

  return labelAxisGroup
}

function shouleShowLabelText(label: Label<number>): boolean {
  return label.end - label.start >= minTextHeight && label.val?.length !== 0
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
