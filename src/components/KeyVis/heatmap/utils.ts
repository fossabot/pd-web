import * as d3 from 'd3'

export function truncateString(str: string, len: number): string {
  if (str.length > len) {
    return str.substr(0, len / 2 - 1) + '....' + str.substr(str.length - len / 2 + 1, str.length)
  } else {
    return str
  }
}

export function clickToCopyBehavior(selection, map) {
  selection.each(function(d) {
    d3.select(this).on('click', () => {
      copyToClipboard(map(d))
    })
  })
}

function copyToClipboard(text: string) {
  const input = d3
    .select('body')
    .append('input')
    .attr('value', text)
  input.node()!.select()
  document.execCommand('copy')
  input.remove()
}
