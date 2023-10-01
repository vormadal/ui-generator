import { CodeGenerator } from '../../configuration/CodeGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import { FormOptions } from '../../configuration/FormOptions'
import GeneratorContent from '../../configuration/GeneratorContent'
import { GeneratorOptions } from '../../configuration/GeneratorOptions'
import { OptionRenderer } from '../../configuration/OptionRenderer'
import { TextFieldOptions } from '../../configuration/TextFieldOptions'
import { UnknownFieldOptions } from '../../configuration/UnknownFieldOptions'
import { ExtendedOperationObject } from '../../openApi/ExtendedOperationObject'
import { OpenApiProperty } from '../../openApi/OpenApiProperty'
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

  createFieldOptions(property: OpenApiProperty): FieldOptions {
    switch (property.type) {
      case 'string':
        return new TextFieldOptions(property)
      default:
        return new UnknownFieldOptions(property)
    }
  }
  createFormOptions(schema: ExtendedOperationObject): FormOptions {
    return new FormOptions(schema)
  }

  generate(options: GeneratorOptions): GeneratorContent[] {
    return this._formGenerator.generate(options)
  }
}
