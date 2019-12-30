import { DataTag, HeatmapData, HeatmapRange } from 'components/KeyVis/heatmap'

export const APIURL = `${process.env.NODE_ENV === 'development' ? 'http://172.16.4.4:2888' : ''}/pd/apis/keyvisual/v1`

export async function fetchHeatmap(selection?: HeatmapRange, type: DataTag = 'written_bytes') {
  let url = `${APIURL}/heatmaps?type=${type}`

  if (selection) {
    url += Object.keys(selection)
      .map(k => `&${k}=${selection[k]}`)
      .join('')
  }

  try {
    const data: HeatmapData = await sendRequest(url, 'get')

    return data
  } catch (e) {
    throw e
  }
}

export async function sendRequest(url: string, method: 'get', params?: object) {
  const res = await fetch(url, {
    method: method,
    mode: 'cors',
    ...params
  })
  return res.json()
}
