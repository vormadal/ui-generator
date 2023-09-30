import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FormOptions } from '../../configuration/FormOptions'
import { groupBy } from '../../utils/arrayExtensions'

export default class RMFFormGenerator {
  getImports(options: FormOptions): ComponentImport[] {
    const values = [
      new ComponentImport('formik', ['Formik', 'Form']),
      new ComponentImport('@mui/material', ['Button']),
      new ComponentImport(options.entityImportPath, [options.entityTypeName])
    ]
    return values
  }

  generate(options: FormOptions, properties: FieldGenerator[]): string {
    const { name, entityTypeName, entityName, entityPropertyName, hasInitialValues } = options

    const combinedImports = [
      ...this.getImports(options),
      ...([] as ComponentImport[]).concat(...properties.map((x) => x.imports))
    ]

    const groupedImports = groupBy(combinedImports, (x) => x.from)
    const mergedImports = Object.keys(groupedImports).map((x) =>
      groupedImports[x].reduce((merged, cur) => {
        return merged.merge(cur)
      })
    )

    const imports = mergedImports.map((x) => x.toString()).join('\n')

    return `
${imports}

interface Props {
  onSubmit: (${entityPropertyName}: ${entityTypeName}) => void | Promise<void>
  ${hasInitialValues ? `${entityPropertyName}: ${entityTypeName}` : ''}
}

export function ${name}({ onSubmit${hasInitialValues ? `, ${entityPropertyName}` : ''} }: Props) {
  
  return (
    <Formik
      ${hasInitialValues ? `initialValues={${entityPropertyName}}` : ''}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, handleBlur }) => (
        <Form>
          ${properties.map((x) => x.generate())}
          <Button type="submit">${hasInitialValues ? 'Save' : 'Create'}</Button>
        </Form>
      )}
    </Formik>
  )
}

export default ${name}
    `
  }
}
