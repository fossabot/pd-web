import { HeatmapData, HeatmapRange } from 'components/KeyVis/heatmap'

const dummyData: HeatmapData = require('fixtures/dummydata.json')
dummyData.timeAxis = dummyData.timeAxis.map(timestamp => timestamp * 1000)

export const APIURL = `${process.env.NODE_ENV === 'development' ? 'http://172.16.4.4:2888' : ''}/pd/apis/keyvisual/v1`

export async function fetchDummyHeatmap() {
  return dummyData
}

let abortHeatmapCtrl, abortHeatmapSignal
export function abortHeatmap() {
  // abortHeatmapCtrl && abortHeatmapCtrl.abort()
}
export async function fetchHeatmap(selection?: HeatmapRange, type = 'write_bytes') {
  let url = `${APIURL}/heatmaps?type=${type}`

  if (selection) {
    url += Object.keys(selection)
      .map(k => `&${k}=${selection[k]}`)
      .join('')
  }
  abortHeatmap()

  abortHeatmapCtrl = new AbortController()
  abortHeatmapSignal = abortHeatmapCtrl.signal

  try {
    const data: HeatmapData = await sendRequest(url, 'get', { signal: abortHeatmapSignal })
    data.timeAxis = data.timeAxis.map(timestamp => timestamp * 1000)

    return data
  } catch (e) {
    throw e
  }
}

export async function sendRequest(url: string, method: 'get', params: object) {
  const res = await fetch(url, {
    method: method,
    mode: 'cors',
    ...params
  })
  return res.json()
}
