import { OpenAPIV3 } from 'openapi-types'
import { CodeGenerator } from '../../configuration/CodeGenerator'
import { FormOptions } from '../../configuration/FormOptions'
import GeneratorContent from '../../configuration/GeneratorContent'
import { OptionRenderer } from '../../configuration/OptionRenderer'
import RMFFormGenerator from './RMFFormGenerator'
import { RMFOptionRenderer } from './RMFOptionRenderer'
import RMFTextFieldGenerator from './RMFTextFieldGenerator'
import RMFBooleanFieldGenerator from './RMFBooleanFieldGenerator'

export default class ReactMuiFormikGenerator implements CodeGenerator {
  supportsView(method: OpenAPIV3.HttpMethods): boolean {
    return [OpenAPIV3.HttpMethods.POST, OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.GET].includes(method)
  }
  supportsField(type: 'array' | OpenAPIV3.NonArraySchemaObjectType): boolean {
    return ['string', 'boolean'].includes(type)
  }
  get name(): string {
    return 'react-mui-formik'
  }

  private readonly _renderer = new RMFOptionRenderer()
  private readonly _formGenerator = new RMFFormGenerator([new RMFTextFieldGenerator(), new RMFBooleanFieldGenerator()])

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
