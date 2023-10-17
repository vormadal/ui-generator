import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import GeneratorContent from '../../configuration/GeneratorContent'

export default class RMFTextFieldGenerator implements FieldGenerator {
  get name() {
    return 'string'
  }
  get imports(): ComponentImport[] {
    return [new ComponentImport('@mui/material', ['TextField'])]
  }

  generate(options: FieldOptions, indents: number): GeneratorContent[] {
    const { name, label, isRequired } = options
    
    const prefix = new Array(indents || 0).fill('\t').join('')
    const content = [
      `${prefix}<TextField`,
      `    name="${name}"`,
      `    label="${label}"`,
      `    value={values.${name}}`,
      `    onChange={handleChange}`,
      `    ${isRequired ? 'required' : ''}`,
      `/>`
    ]

    return [new GeneratorContent('partial', content.join(`\n${prefix}`))]
  }
}
