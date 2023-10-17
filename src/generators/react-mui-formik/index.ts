import { CodeGenerator } from '../../configuration/CodeGenerator'
import { FormOptions } from '../../configuration/FormOptions'
import GeneratorContent from '../../configuration/GeneratorContent'
import { OptionRenderer } from '../../configuration/OptionRenderer'
import RMFFormGenerator from './RMFFormGenerator'
import { RMFOptionRenderer } from './RMFOptionRenderer'
import RMFTextFieldGenerator from './RMFTextFieldGenerator'

export default class ReactMuiFormikGenerator implements CodeGenerator {
  get name(): string {
    return 'react-mui-formik'
  }

  private readonly _renderer = new RMFOptionRenderer()
  private readonly _formGenerator = new RMFFormGenerator([new RMFTextFieldGenerator()])

  get renderer(): OptionRenderer {
    return this._renderer
  }

  generate(options: FormOptions[]): GeneratorContent[] {
    if (!options) return []

    return options.reduce<GeneratorContent[]>((list, val) => {
      const generated = this._formGenerator.generate(val)
      for (const content of generated) {
        list.push(content)
      }
      return list
    }, [])
  }
}
