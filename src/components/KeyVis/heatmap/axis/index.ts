export type Section<T, U> = {
  val: T
  start: U
  end: U
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
        commonStart - mergedSmallSection.end > mergeWidth
      ) {
        result.push({
          val: merge(mergedSmallSection.val, section.val),
          start: mergedSmallSection.start,
          end: mergedSmallSection.end
        })
        mergedSmallSection = null
      }
    }

    if (commonEnd - commonStart > 0) {
      if (commonEnd - commonStart > mergeWidth) {
        result.push({ val: section.val, start: commonStart, end: commonEnd })
        mergedSmallSection = null
      } else {
        if (mergedSmallSection === null) {
          mergedSmallSection = { val: section.val, start: commonStart, end: commonEnd }
        } else {
          mergedSmallSection.end = commonEnd
        }
      }
    }
  }

  return result
}
