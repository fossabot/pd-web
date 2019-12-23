import { HeatmapData, HeatmapRange } from 'components/KeyVis/heatmap'

export const APIURL = `${process.env.NODE_ENV === 'development' ? 'http://172.16.4.4:2888' : ''}/pd/apis/keyvisual/v1`

export async function fetchHeatmap(selection?: HeatmapRange, type = 'written_bytes') {
  let url = `${APIURL}/heatmaps?type=${type}`

  if (selection) {
    url += Object.keys(selection)
      .map(k => `&${k}=${selection[k]}`)
      .join('')
  }

  const data: HeatmapData = await sendRequest(url, 'get')
  data.timeAxis = data.timeAxis.map(timestamp => timestamp * 1000)

  return data
}

export async function sendRequest(url: string, method: 'get') {
  const res = await fetch(url, {
    method: method,
    mode: 'cors'
  })
  return res.json()
}
