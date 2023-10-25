import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import { View } from '../../configuration/FormOptions'
import GeneratorContent from '../../configuration/GeneratorContent'
import { groupBy } from '../../utils/arrayExtensions'
import DefaultFieldGenerator from '../default/DefaultFieldGenerator'

export default class RMFFormGenerator {
  constructor(private readonly _fieldGenerators: FieldGenerator[]) {}

  getImports(options: View): ComponentImport[] {
    const values = [
      new ComponentImport('formik', ['Formik', 'Form']),
      new ComponentImport('@mui/material', ['Button']),
      new ComponentImport(options.entityImportPath, [options.entityTypeName])
    ]
    return values
  }

  getFieldGenerator(options: FieldOptions): FieldGenerator {
    return this._fieldGenerators.find((x) => x.name === options.type) || new DefaultFieldGenerator()
  }

  generate(options: View): GeneratorContent[] {
    const { name, entityTypeName, entityPropertyName, hasInitialValues } = options ?? {}

    const combinedImports = [
      ...this.getImports(options),
      ...([] as ComponentImport[]).concat(
        ...options.fields.map((fieldOption) => this.getFieldGenerator(fieldOption).imports)
      )
    ]

    const groupedImports = groupBy(combinedImports, (x) => x.from)
    const mergedImports = Object.keys(groupedImports).map((x) =>
      groupedImports[x].reduce((merged, cur) => {
        return merged.merge(cur)
      })
    )

    const imports = mergedImports.map((x) => x.toString()).join('\n')

    const fieldIndents = 5

    const fields = ([] as GeneratorContent[]).concat(
      ...options.fields.map((x) => this.getFieldGenerator(x).generate(x, fieldIndents))
    )
    const content = `
${imports}

interface Props {
  onSubmit: (${entityPropertyName}: ${entityTypeName}) => void | Promise<void>
  ${hasInitialValues ? `${entityPropertyName}: ${entityTypeName}` : ''}
}

export function ${name}({ onSubmit${hasInitialValues ? `, ${entityPropertyName}` : ''} }: Props) {
  
  return (
    <Formik
      initialValues={${hasInitialValues ? entityPropertyName : `new ${entityTypeName}()`}}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, handleBlur }) => (
        <Form>
${fields.map((x) => x.content).join('\n')}
          <Button type="submit">${hasInitialValues ? 'Save' : 'Create'}</Button>
        </Form>
      )}
    </Formik>
  )
}

export default ${name}
    `

    return [new GeneratorContent('file', content, `src/components/${name}.tsx`)]
  }
}
