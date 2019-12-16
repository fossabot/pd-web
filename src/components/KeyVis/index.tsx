import React, { useState, useEffect } from 'react'
import { Heatmap, HeatmapData, HeatmapRange } from './heatmap'
import { fetchDummyHeatmap, fetchHeatmap } from 'api/keyvis'

import ToolBar from './ToolBar'

const DEFAULT_INTERVAL = 15000
const USE_LOCAL_DATA = true

// Todo: define heatmap state, with auto check control, date range select, reset to zoom
export interface IKeyVisState {
  heatmapData: HeatmapData
}

// fetchData ,  changeType, add loading state, change zoom level to reset autofetch,

const KeyVis = () => {
  let timerId,
    _chart,
    brightLevel = 1

  const [heatmapData, setHeatmapData] = useState<HeatmapData>()

  const [isLoading, setLoading] = useState(true)
  const [isAutoFetch, setAutoFetch] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!heatmapData) setHeatmapData(await fetchDummyHeatmap())
    }
    load()
    return () => {
      console.log('will unmount')
      _chart = null
      clearInterval(timerId)
    }
  }, [heatmapData])

  const _fetchHeatmap = async (selection?: HeatmapRange) => {
    // loading effect
    // setLoading(true)
    setHeatmapData(await fetchHeatmap(selection))
    // setLoading(false)
  }

  const onAdjustBright = (type: 'up' | 'down' | 'reset') => {
    // adjustBright-invoke instance.method
    if (!_chart) return
    let newBrightLevel
    switch (type) {
      case 'up':
        newBrightLevel = brightLevel * 2
        break
      case 'down':
        newBrightLevel = brightLevel / 2
        break
      case 'reset':
        newBrightLevel = 1
        break
    }
    if (newBrightLevel > 5 || newBrightLevel < 0.1) newBrightLevel = 1
    _chart.brightness(newBrightLevel)
    // TODO: trigger React
  }

  const onToggleAutoFetch = (enable: Boolean) => {
    if (enable) {
      timerId = setInterval(() => {
        _fetchHeatmap()
      }, DEFAULT_INTERVAL)
      _fetchHeatmap()
    } else {
      clearInterval(timerId)
    }
  }

  const onChangeMetric = value => {
    console.log(value)
  }

  const onChartInit = chart => {
    _chart = chart
  }

  const onChangeDateRange = (v: number) => {
    const endTime = new Date().getTime()
    const selection: HeatmapRange = {
      startTime: endTime - v,
      endTime
    }
    _fetchHeatmap(selection)
  }

  const onBrush = (selection: HeatmapRange) => {
    onToggleAutoFetch(false)
    // TODO: change toolbar enable status
    _fetchHeatmap(selection)
  }

  return (
    <div className="PD-KeyVis">
      <ToolBar
        isLoading={isLoading}
        isAutoFetch={isAutoFetch}
        onAdjustBright={onAdjustBright}
        onChangeMetric={onChangeMetric}
        onChangeDateRange={onChangeDateRange}
        onToggleAutoFetch={onToggleAutoFetch}
      />
      {heatmapData ? <Heatmap data={heatmapData} onBrush={onBrush} onChartInit={onChartInit} /> : <></>}
    </div>
  )
}

export default KeyVis
