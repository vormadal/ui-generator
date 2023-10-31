import { OpenAPIV3 } from 'openapi-types'
import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import GeneratorContent from '../../configuration/GeneratorContent'

export default class RMFDateTimeFieldGenerator implements FieldGenerator {
  get name() {
    return 'date-time'
  }
  get imports(): ComponentImport[] {
    return [new ComponentImport('@mui/x-date-pickers', ['DateTimePicker'])]
  }

  isSupporting(schema: OpenAPIV3.SchemaObject): boolean {
    return schema.format === 'date-time'
  }

  generate(options: FieldOptions, indents: number): GeneratorContent[] {
    const { name, label, isRequired } = options

    const prefix = new Array(indents || 0).fill('\t').join('')
    const content = [
      `${prefix}<DateTimePicker`,
      `    label="${label}"`,
      `    ampm={false}`,
      `    value={values.${name} || null}`,
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
