import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import GeneratorContent from '../../configuration/GeneratorContent'

export default class RMFBooleanFieldGenerator implements FieldGenerator {
  get name() {
    return 'boolean'
  }
  get imports(): ComponentImport[] {
    return [new ComponentImport('@mui/material', ['FormControlLabel', 'Checkbox'])]
  }

  generate(options: FieldOptions, indents: number): GeneratorContent[] {
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

    return [new GeneratorContent('partial', content.filter((x) => !!x.trim()).join(`\n${prefix}`))]
  }
}
