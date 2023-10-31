import { OpenAPIV3 } from 'openapi-types'
import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import GeneratorContent from '../../configuration/GeneratorContent'

export default class RMFDateFieldGenerator implements FieldGenerator {
  get name() {
    return 'date'
  }
  get imports(): ComponentImport[] {
    return [new ComponentImport('@mui/x-date-pickers', ['DatePicker'])]
  }

  isSupporting(schema: OpenAPIV3.SchemaObject): boolean {
    console.log('is supporting', schema.format, schema.type)
    return schema.format === 'date'
  }

  generate(options: FieldOptions, indents: number): GeneratorContent[] {
    const { name, label, isRequired } = options

    const prefix = new Array(indents || 0).fill('\t').join('')
    const content = [
      `${prefix}<DatePicker`,
      `    label="${label}"`,
      `    value={values.${name}}`,
      `    onChange={value => setFieldValue('${name}', value)}`,
      `    slotProps={{`,
      `       textField: {`,
      `         name: '${name}'`,
      `       }`,
      `    }}`,
      `    ${isRequired ? 'required' : ''}`,
      `/>`
    ]

    return [new GeneratorContent('partial', content.filter((x) => !!x.trim()).join(`\n${prefix}`))]
  }
}
