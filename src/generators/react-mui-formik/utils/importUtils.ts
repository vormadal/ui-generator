import { ComponentImport } from '../../../configuration/ComponentImport'
import { groupBy } from '../../../utils/arrayExtensions'

export function mergeImports(imports: ComponentImport[]) {
  const groupedImports = groupBy(imports, (x) => x.from)
  const mergedImports = Object.keys(groupedImports).map((x) =>
    groupedImports[x].reduce((merged, cur) => {
      return merged.merge(cur)
    })
  )

  return mergedImports
}
