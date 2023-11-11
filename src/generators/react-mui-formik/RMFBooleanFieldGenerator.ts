import { OpenAPIV3 } from 'openapi-types'
import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'

export default class RMFBooleanFieldGenerator implements FieldGenerator {
  isSupporting(schema: OpenAPIV3.SchemaObject): boolean {
    return schema.type === 'boolean'
  }
  get name() {
    return 'boolean'
  }
  get imports(): ComponentImport[] {
    return [new ComponentImport('@mui/material', ['FormControlLabel', 'Checkbox'])]
  }

  generate = (options: FieldOptions, indents: number): string => {
    const { name, label, isRequired } = options

    const prefix = new Array(indents || 0).fill('\t').join('')
    const content = [
      `${prefix}<FormControlLabel`,
      `    ${isRequired ? 'required' : ''}`,
      `    name="${name}"`,
      `    onChange={handleChange}`,
      `    value={values.${name}}`,
      `    control={<Checkbox />}`,
      `    label="${label}"`,
      `/>`
    ]

    return content.filter((x) => !!x.trim()).join(`\n${prefix}`)
  }
}
