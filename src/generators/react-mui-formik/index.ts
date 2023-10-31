import { OpenAPIV3 } from 'openapi-types'
import { CodeGenerator } from '../../configuration/CodeGenerator'
import { View } from '../../configuration/FormOptions'
import GeneratorContent from '../../configuration/GeneratorContent'
import { Option, TextOption } from '../../configuration/Option'
import { FirstUppercase } from '../../utils/stringHelpers'
import RMFBooleanFieldGenerator from './RMFBooleanFieldGenerator'
import RMFFormGenerator from './RMFFormGenerator'
import RMFTextFieldGenerator from './RMFTextFieldGenerator'
import RMFDateTimeFieldGenerator from './RMFDateTimeFieldGenerator'
import RMFDateFieldGenerator from './RMFDateFieldGenerator'
import RouteGenerator from './RouteGenerator'
import ProjectConfiguration from '../../system/ProjectConfiguration'
import ApiGenerator from './ApiGenerator'

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

const fieldGenerators = [
  new RMFBooleanFieldGenerator(),
  new RMFDateTimeFieldGenerator(),
  new RMFDateFieldGenerator(),
  new RMFTextFieldGenerator()
]
export default class ReactMuiFormikGenerator implements CodeGenerator {
  getViewOptions(
    path: string,
    method: OpenAPIV3.HttpMethods,
    entityName: string,
    content: OpenAPIV3.SchemaObject
  ): Option[] {
    const name = resolveViewName(method, entityName, content)

    return [
      new TextOption('View name', 'name', name),
      new TextOption('Route', 'route', path.replace(/{/g, ':').replace(/}/g, ''))
    ]
  }
  supportsView(method: OpenAPIV3.HttpMethods): boolean {
    return [OpenAPIV3.HttpMethods.POST, OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.GET].includes(method)
  }

  supportsField(schema: OpenAPIV3.SchemaObject): boolean {
    return fieldGenerators.map((x) => x.isSupporting(schema)).includes(true)
  }

  get name(): string {
    return 'react-mui-formik'
  }

  private readonly _formGenerator = new RMFFormGenerator(fieldGenerators)

  private readonly _apiGenerator = new ApiGenerator()
  private readonly _routeGenerator = new RouteGenerator()

  generate(options: View[], viewOnly?: boolean, project?: ProjectConfiguration): GeneratorContent[] {
    if (!options) return []

    const content: GeneratorContent[] = []
    if (!viewOnly) {
      content.push(...this._apiGenerator.generate(project))
      content.push(this._routeGenerator.generate(options))
    }

    return options.reduce<GeneratorContent[]>((list, val) => {
      const generated = this._formGenerator.generate(val)
      for (const content of generated) {
        list.push(content)
      }
      return list
    }, content)
  }
}
