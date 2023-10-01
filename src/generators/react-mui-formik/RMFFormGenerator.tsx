import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import { FormOptions } from '../../configuration/FormOptions'
import GeneratorContent from '../../configuration/GeneratorContent'
import { GeneratorOptions } from '../../configuration/GeneratorOptions'
import { groupBy } from '../../utils/arrayExtensions'
import DefaultFieldGenerator from '../default/DefaultFieldGenerator'

export default class RMFFormGenerator {
  constructor(private readonly _fieldGenerators: FieldGenerator[]) {}

  getImports(options: FormOptions): ComponentImport[] {
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

  generate(options: GeneratorOptions): GeneratorContent[] {
    const { name, entityTypeName, entityName, entityPropertyName, hasInitialValues } = options.formOptions

    const combinedImports = [
      ...this.getImports(options.formOptions),
      ...([] as ComponentImport[]).concat(
        ...options.fieldOptions.map((fieldOption) => this.getFieldGenerator(fieldOption).imports)
      )
    ]

    const groupedImports = groupBy(combinedImports, (x) => x.from)
    const mergedImports = Object.keys(groupedImports).map((x) =>
      groupedImports[x].reduce((merged, cur) => {
        return merged.merge(cur)
      })
    )

    const imports = mergedImports.map((x) => x.toString()).join('\n')

    const content = `
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
          ${options.fieldOptions.map((x) => this.getFieldGenerator(x).generate(x))}
          <Button type="submit">${hasInitialValues ? 'Save' : 'Create'}</Button>
        </Form>
      )}
    </Formik>
  )
}

export default ${name}
    `

    return [new GeneratorContent('file', content, `components/${name}.tsx`)]
  }
}
