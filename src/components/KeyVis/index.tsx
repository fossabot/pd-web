import React, { useState, useEffect, useCallback } from 'react'
import { Heatmap, HeatmapData, HeatmapRange, DataTag } from './heatmap'
import { fetchDummyHeatmap, fetchHeatmap } from 'api/keyvis'

import ToolBar from './ToolBar'

const DEFAULT_INTERVAL = 60000

// Todo: define heatmap state, with auto check control, date range select, reset to zoom
// fetchData ,  changeType, add loading state, change zoom level to reset autofetch,

type DataState = {
  heatmapData: HeatmapData
  metricType: DataTag
}

let _chart

const KeyVis = props => {
  let brightLevel = 1

  const [dataState, setDataState] = useState<DataState>()

  const [isLoading, setLoading] = useState(false)
  const [isAutoFetch, setAutoFetch] = useState(false)
  const [isOnBrush, setOnBrush] = useState(false)
  const [dateRange, setDateRange] = useState(3600 * 12)
  const [metricType, setMetricType] = useState<DataTag>('written_bytes')

  console.log('Keyvis Init')

  useEffect(() => {
    const load = async () => {
      if (!dataState) setDataState({ heatmapData: await fetchDummyHeatmap(), metricType: metricType })
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

    setDataState({ heatmapData: data, metricType: metricType })

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
    _chart()
  }

  const onToggleAutoFetch = (enable: Boolean | undefined) => {
    if (enable == undefined) {
      enable = !isAutoFetch
    }
    setAutoFetch(enable as boolean)
    if (enable) {
      _chart.resetZoom()
      _chart()
      _fetchHeatmap()
    }
  }

  const onChangeMetric = async value => {
    setMetricType(value)
    await _fetchHeatmap()
  }

  const onChartInit = useCallback(
    chart => {
      _chart = chart
      _chart()
    },
    [props]
  )

  const onChangeDateRange = (v: number) => {
    setDateRange(v)
    _fetchHeatmap()
  }

  const onResetZoom = () => {
    _fetchHeatmap()
  }

  const onToggleBrush = () => {
    setAutoFetch(false)
    setOnBrush(!isOnBrush)
    _chart.brush(!isOnBrush)
    _chart()
  }

  const onBrush = useCallback(
    (selection: HeatmapRange) => {
      setOnBrush(false)
      setAutoFetch(false)
      _fetchHeatmap(selection)
      _chart()
    },
    [props]
  )

  const onZoom = useCallback(() => {
    setAutoFetch(false)
  }, [props])

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
      {dataState ? (
        <Heatmap
          data={dataState.heatmapData}
          dataTag={dataState.metricType}
          onBrush={onBrush}
          onChartInit={onChartInit}
          onZoom={onZoom}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default KeyVis
