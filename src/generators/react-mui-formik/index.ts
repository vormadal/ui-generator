import { OpenAPIV3 } from 'openapi-types'
import { CodeGenerator } from '../../configuration/CodeGenerator'
import { View } from '../../configuration/View'
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
import Endpoint from '../../openApi/Endpoint'
import { resolveViewName } from './utils/ViewUtils'
import OpenApiSchema from '../../openApi/OpenApiSchema'

//TODO move to a generic place

const fieldGenerators = [
  new RMFBooleanFieldGenerator(),
  new RMFDateTimeFieldGenerator(),
  new RMFDateFieldGenerator(),
  new RMFTextFieldGenerator()
]
export default class ReactMuiFormikGenerator implements CodeGenerator {
  getViewOptions(
    endpoint: Endpoint,
    entityName: string,
    schema: OpenAPIV3.SchemaObject,
    spec: OpenApiSchema
  ): Option[] {
    const name = resolveViewName(endpoint.method, entityName, schema)

    const viewSuffix = [OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.POST].includes(endpoint.method)
      ? 'Form'
      : 'View'
    const options: Option[] = [
      new TextOption('View name', 'name', `${name}${viewSuffix}`),
      new TextOption('Route', 'route', endpoint.path.replace(/{/g, ':').replace(/}/g, '')),
      new TextOption('Page name', 'pageName', `${name}Page`)
    ]

    switch (endpoint.method) {
      case OpenAPIV3.HttpMethods.POST:
        options.push(new TextOption('Create endpoint', 'createEndpointName', endpoint.operationName))
        break
      case OpenAPIV3.HttpMethods.PUT:
        options.push(
          new TextOption('Update endpoint', 'updateEndpointName', endpoint.operationName),
          new TextOption(
            'Get endpoint',
            'getEndpointName',
            spec.resolveEndpoint(OpenAPIV3.HttpMethods.GET, endpoint.path)?.operationName
          )
        )
        break
    }

    return options
  }
  supportsView(endpoint: Endpoint): boolean {
    return [OpenAPIV3.HttpMethods.POST, OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.GET].includes(endpoint.method)
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

  async generate(options: View[], viewOnly?: boolean, project?: ProjectConfiguration): Promise<GeneratorContent[]> {
    if (!options) return []

    const content: GeneratorContent[] = []
    if (!viewOnly) {
      content.push(... await this._apiGenerator.generate(project))
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
