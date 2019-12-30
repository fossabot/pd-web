import React, { useState, useEffect, useCallback } from 'react'
import { Heatmap, HeatmapData, HeatmapRange, DataTag } from './heatmap'
import { fetchHeatmap } from 'api/keyvis'

import ToolBar from './ToolBar'

const DEFAULT_INTERVAL = 60000

// Todo: define heatmap state, with auto check control, date range select, reset to zoom
// fetchData ,  changeType, add loading state, change zoom level to reset autofetch,

type ChartState = {
  heatmapData: HeatmapData
  metricType: DataTag
}

// TODO: using global state is not a good idea
let _chart
let latestFetchIdx = 0

const KeyVis = props => {
  const [chartState, setChartState] = useState<ChartState>()

  const [isLoading, setLoading] = useState(false)
  const [isAutoFetch, setAutoFetch] = useState(false)
  const [isOnBrush, setOnBrush] = useState(false)
  const [dateRange, setDateRange] = useState(3600 * 12)
  const [brightLevel, setBrightLevel] = useState(1)
  const [metricType, setMetricType] = useState<DataTag>('written_bytes')

  console.log('Keyvis Init')

  useEffect(() => {
    const load = async () => {
      if (!chartState) setChartState({ heatmapData: await fetchHeatmap({}, metricType), metricType: metricType })
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
    // abortHeatmapCtrl.abort()
    setLoading(true)
    if (!selection) {
      const endTime = Math.ceil(new Date().getTime() / 1000)
      selection = {
        starttime: endTime - dateRange,
        endtime: endTime
      }
    }
    setOnBrush(false)
    latestFetchIdx += 1
    const fetchIdx = latestFetchIdx
    // FIXME: Outdated var metricType
    const data = await fetchHeatmap(selection, metricType)
    if (fetchIdx === latestFetchIdx) {
      setChartState({ heatmapData: data, metricType: metricType })
    }
    setLoading(false)
  }

  const onChangeBrightLevel = val => {
    if (!_chart) return
    setBrightLevel(val)
    const update = async () => {
      await _chart.brightness(val)
      setLoading(false)
    }
    setLoading(true)
    update()
  }

  const onToggleAutoFetch = (enable: Boolean | undefined) => {
    if (enable === undefined) {
      enable = !isAutoFetch
    }
    setAutoFetch(enable as boolean)
    if (enable) {
      _chart.resetZoom()
      setOnBrush(false)
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
      console.log(_chart.getLegend())
      setLoading(false)
    },
    [props]
  )

  const onChangeDateRange = (v: number) => {
    setDateRange(v)
    _fetchHeatmap()
  }

  const onResetZoom = () => {
    // TODO
    _fetchHeatmap()
  }

  const onToggleBrush = () => {
    setAutoFetch(false)
    setOnBrush(!isOnBrush)
    _chart.brush(!isOnBrush)
  }

  const onBrush = useCallback(
    (selection: HeatmapRange) => {
      setOnBrush(false)
      setAutoFetch(false)
      _fetchHeatmap(selection)
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
        brightLevel={brightLevel}
        onToggleBrush={onToggleBrush}
        onResetZoom={onResetZoom}
        isLoading={isLoading}
        isAutoFetch={isAutoFetch}
        isOnBrush={isOnBrush}
        onChangeBrightLevel={onChangeBrightLevel}
        onChangeMetric={onChangeMetric}
        onChangeDateRange={onChangeDateRange}
        onToggleAutoFetch={onToggleAutoFetch}
      />
      {chartState ? (
        <Heatmap
          data={chartState.heatmapData}
          dataTag={chartState.metricType}
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
