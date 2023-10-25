import { OpenAPIV3 } from 'openapi-types'
import { CodeGenerator } from '../../configuration/CodeGenerator'
import { View } from '../../configuration/FormOptions'
import GeneratorContent from '../../configuration/GeneratorContent'
import { Option, TextOption } from '../../configuration/Option'
import { FirstUppercase } from '../../utils/stringHelpers'
import RMFBooleanFieldGenerator from './RMFBooleanFieldGenerator'
import RMFFormGenerator from './RMFFormGenerator'
import RMFTextFieldGenerator from './RMFTextFieldGenerator'

//TODO move to a generic place
function resolveViewName(method: OpenAPIV3.HttpMethods, entityName: string, content: OpenAPIV3.SchemaObject) {
  let prefix = ''
  let suffix = ''
  let name = FirstUppercase(entityName)
  if (name.endsWith('Dto')) {
    name = name.substring(0, name.length - 3)
  }

  switch (method) {
    case OpenAPIV3.HttpMethods.GET:
      prefix = content.type == 'array' ? 'List' : 'Detail'
      suffix = 'View'
      break
    case OpenAPIV3.HttpMethods.POST:
      prefix = 'Create'
      suffix = 'Form'
      break
    case OpenAPIV3.HttpMethods.PUT:
      prefix = 'Update'
      suffix = 'Form'
      break
    default:
      prefix = method.toLowerCase()
      suffix = 'View'
      break
  }
  if (name.startsWith(prefix)) prefix = ''
  if (name.endsWith(suffix)) suffix = ''

  return `${prefix}${name}${suffix}`
}

const fieldGenerators = [new RMFTextFieldGenerator(), new RMFBooleanFieldGenerator()]
export default class ReactMuiFormikGenerator implements CodeGenerator {
  getViewOptions(method: OpenAPIV3.HttpMethods, entityName: string, content: OpenAPIV3.SchemaObject): Option[] {
    const name = resolveViewName(method, entityName, content)

    return [new TextOption('View name', 'name', name)]
  }
  supportsView(method: OpenAPIV3.HttpMethods): boolean {
    return [OpenAPIV3.HttpMethods.POST, OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.GET].includes(method)
  }

  supportsField(type: 'array' | OpenAPIV3.NonArraySchemaObjectType): boolean {
    return fieldGenerators.map((x) => x.name).includes(type)
  }

  get name(): string {
    return 'react-mui-formik'
  }

  private readonly _formGenerator = new RMFFormGenerator(fieldGenerators)

  generate(options: View[]): GeneratorContent[] {
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
