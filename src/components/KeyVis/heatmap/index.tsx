import React, { useRef, useCallback, useEffect } from 'react'
import * as d3 from 'd3'
import { heatmapChart } from './chart'

export type HeatmapRange = {
  startTime?: number
  endTime?: number
  startKey?: string
  endKey?: string
}

export type KeyAxisEntry = {
  key: string
  labels: string[]
}

export type HeatmapData = {
  timeAxis: number[]
  keyAxis: KeyAxisEntry[]
  data: {
    integration: number[][]
    read_bytes: number[][]
    written_bytes: number[][]
    read_keys: number[][]
    written_keys: number[][]
  }
}

export type DataTag = 'integration' | 'written_bytes' | 'read_bytes' | 'written_keys' | 'read_keys'

export function tagUnit(tag: DataTag): string {
  switch (tag) {
    case 'integration':
      return 'bytes/min'
    case 'read_bytes':
      return 'bytes/min'
    case 'written_bytes':
      return 'bytes/min'
    case 'read_keys':
      return 'keys/min'
    case 'written_keys':
      return 'keys/min'
  }
}

type HeatmapProps = {
  data: HeatmapData
  onBrush: (selection: HeatmapRange) => void
  onZoom: () => void
  onChartInit: (any) => void
}

const _Heatmap: React.FunctionComponent<HeatmapProps> = props => {
  const divRef: React.RefObject<HTMLDivElement> = useRef(null)

  let chart, data

  useEffect(() => {
    console.log('side effect in heatmap')
    if (divRef.current != null) {
      console.log('side effect in heatmap inside')
      const container = divRef.current
      chart = heatmapChart(d3.select(container), props.onBrush, props.onZoom)
      if (data == props.data) return
      data = props.data
      chart.data(props.data)
      props.onChartInit(chart)
      const render = () => {
        const width = container.offsetWidth
        const height = container.offsetHeight
        chart.size(width, height)
      }
      window.onresize = render
      render()
    }
  }, [props.data])

  return <div className="heatmap" ref={divRef} />
}

export const Heatmap = React.memo(_Heatmap)
