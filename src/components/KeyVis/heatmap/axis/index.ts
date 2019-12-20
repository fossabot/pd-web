export type Section<T, U> = {
  val: T
  start: U
  end: U
  idx: number
}

const mergeWidth = 3

export function scaleSections<T, U>(
  sections: Section<T, U>[],
  range: [number, number],
  scale: (t: U) => number,
  merge: (origin: T, val: T) => T
): Section<T, number>[] {
  let result: Section<T, number>[] = []
  let mergedSmallSection: Section<T, number> | null = null
  let oneSectionRendered = false

  for (const section of sections) {
    const canvasStart = range[0]
    const canvasEnd = range[1]
    const startPos = scale(section.start)
    const endPos = scale(section.end)
    const commonStart = Math.max(startPos, canvasStart)
    const commonEnd = Math.min(endPos, canvasEnd)

    if (mergedSmallSection) {
      if (
        mergedSmallSection.end - mergedSmallSection.start >= mergeWidth ||
        commonStart - mergedSmallSection.end > mergeWidth ||
        (!oneSectionRendered && section.idx % 2 === 0)
      ) {
        result.push(mergedSmallSection)
        oneSectionRendered = true
        mergedSmallSection = null
      }
    }

    if (commonEnd - commonStart > 0) {
      if (commonEnd - commonStart > mergeWidth) {
        result.push({ val: section.val, start: commonStart, end: commonEnd, idx: section.idx })
        oneSectionRendered = true
        mergedSmallSection = null
      } else {
        if (mergedSmallSection === null) {
          mergedSmallSection = { val: section.val, start: commonStart, end: commonEnd, idx: section.idx }
        } else {
          mergedSmallSection.val = merge(mergedSmallSection.val, section.val)
          mergedSmallSection.end = commonEnd
        }
      }
    }
  }

  return result
}
