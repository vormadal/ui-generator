import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import GeneratorContent from '../../configuration/GeneratorContent'
import { TextFieldOptions } from '../../configuration/TextFieldOptions'

export default class RMFTextFieldGenerator implements FieldGenerator {
  get name() {
    return 'string'
  }
  get imports(): ComponentImport[] {
    return [new ComponentImport('@mui/material', ['TextField'])]
  }

  generate(options: TextFieldOptions): GeneratorContent[] {
    const { name, label, validation } = options
    const { isRequired } = validation
    const content = `
    <TextField
        name="${name}"
        label="${label}"
        value={values.${name}}
        onChange={handleChange}
        ${isRequired ? 'required' : ''}
      />
    `

    return [new GeneratorContent('partial', content)]
  }
}
