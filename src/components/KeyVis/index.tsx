import React, { useState, useEffect } from 'react'
import { Heatmap, HeatmapData, HeatmapRange } from './heatmap'
import { fetchHeatmap } from 'api/keyvis'

import ToolBar from './ToolBar'

const DEFAULT_INTERVAL = 60000

// Todo: define heatmap state, with auto check control, date range select, reset to zoom
// fetchData ,  changeType, add loading state, change zoom level to reset autofetch,

let _chart

const KeyVis = () => {
  let brightLevel = 1

  const [heatmapData, setHeatmapData] = useState<HeatmapData>()

  const [isLoading, setLoading] = useState(false)
  const [isAutoFetch, setAutoFetch] = useState(false)
  const [isOnBrush, setOnBrush] = useState(false)
  const [dateRange, setDateRange] = useState(3600 * 12)
  const [metricType, setMetricType] = useState('written_bytes')

  console.log('Keyvis Init')

  useEffect(() => {
    const load = async () => {
      if (!heatmapData) setHeatmapData(await fetchHeatmap({}, metricType))
    }
    load()
  }, [])

  useEffect(() => {
    console.log('side effect in keyvis')

    const timerId =
      isAutoFetch &&
      setInterval(() => {
        _fetchHeatmap()
      }, DEFAULT_INTERVAL)

    return () => {
      console.log('side effect in keyvis cleanup')
      // _chart = null
      timerId && clearInterval(timerId)
    }
  }, [isAutoFetch])

  const _fetchHeatmap = async (selection?: HeatmapRange) => {
    // loading effect
    setLoading(true)
    if (!selection) {
      const endTime = Math.ceil(new Date().getTime() / 1000)
      selection = {
        startTime: endTime - dateRange,
        endTime
      }
    }
    const data = await fetchHeatmap(selection, metricType)

    setHeatmapData(data)

    setLoading(false)
  }

  const onAdjustBright = (type: 'up' | 'down' | 'reset') => {
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
  }

  const onToggleAutoFetch = (enable: Boolean | undefined) => {
    if (enable == undefined) {
      enable = !isAutoFetch
    }
    setAutoFetch(enable as boolean)
    if (enable) _fetchHeatmap()
  }

  const onChangeMetric = async value => {
    setMetricType(value)
    _chart.dataTag(value)
    await _fetchHeatmap()
    _chart.dataTag(value)
  }

  const onChartInit = chart => {
    _chart = chart
  }

  const onChangeDateRange = (v: number) => {
    setDateRange(v)
    _fetchHeatmap()
  }

  const onResetZoom = () => {
    _chart.resetZoom()
    _fetchHeatmap()
  }

  const onToggleBrush = () => {
    setAutoFetch(false)
    setOnBrush(!isOnBrush)
    _chart.brush(!isOnBrush)
  }

  const onBrush = (selection: HeatmapRange) => {
    setAutoFetch(false)
    _fetchHeatmap(selection)
  }

  const onZoom = () => {
    setAutoFetch(false)
  }

  return (
    <div className="PD-KeyVis">
      <ToolBar
        dateRange={dateRange}
        metricType={metricType}
        onToggleBrush={onToggleBrush}
        onResetZoom={onResetZoom}
        isLoading={isLoading}
        isAutoFetch={isAutoFetch}
        isOnBrush={isOnBrush}
        onAdjustBright={onAdjustBright}
        onChangeMetric={onChangeMetric}
        onChangeDateRange={onChangeDateRange}
        onToggleAutoFetch={onToggleAutoFetch}
      />
      {heatmapData ? <Heatmap data={heatmapData} onBrush={onBrush} onChartInit={onChartInit} onZoom={onZoom} /> : <></>}
    </div>
  )
}

export default KeyVis
