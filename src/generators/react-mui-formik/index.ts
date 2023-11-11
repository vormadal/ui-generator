import { OpenAPIV3 } from 'openapi-types'
import { CodeGenerator } from '../../configuration/CodeGenerator'
import GeneratorContent from '../../configuration/GeneratorContent'
import { Option, TextOption } from '../../configuration/Option'
import { View } from '../../configuration/View'
import Endpoint from '../../openApi/Endpoint'
import OpenApiSchema from '../../openApi/OpenApiSchema'
import ProjectConfiguration from '../../system/ProjectConfiguration'
import ApiGenerator from './ApiGenerator'
import AppGenerator from './AppGenerator'
import NavigationGenerator from './NavigationGenerator'
import RMFBooleanFieldGenerator from './RMFBooleanFieldGenerator'
import RMFDateFieldGenerator from './RMFDateFieldGenerator'
import RMFDateTimeFieldGenerator from './RMFDateTimeFieldGenerator'
import RMFFormGenerator from './RMFFormGenerator'
import RMFTextFieldGenerator from './RMFTextFieldGenerator'
import RouteGenerator from './RouteGenerator'
import { resolveViewName } from './utils/ViewUtils'
import { RMFContext } from './RMFContext'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import RMFPageGenerator from './RMFPageGenerator'
import PackageJsonGenerator from './PackageJsonGenerator'

const fieldGenerators: FieldGenerator[] = [
  new RMFBooleanFieldGenerator(),
  new RMFDateTimeFieldGenerator(),
  new RMFDateFieldGenerator(),
  new RMFTextFieldGenerator()
]
export default class ReactMuiFormikGenerator implements CodeGenerator {
  getViewOptions(view: View, spec: OpenApiSchema): Option[] {
    const { endpoint } = view
    const name = resolveViewName(view)

    const viewSuffix = [OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.POST].includes(view.endpoint.method)
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

  generate(views: View[], viewOnly?: boolean, project?: ProjectConfiguration): GeneratorContent[] {
    if (!views) return []

    const context = new RMFContext(fieldGenerators)
    const content: GeneratorContent[] = []
    if (!viewOnly) {
      const api = new ApiGenerator(project)
      const packageJson = new PackageJsonGenerator(project, api)
      const route = new RouteGenerator(views)
      const navigation = new NavigationGenerator(views, route, project)
      const app = new AppGenerator()
      const pages = views.map((x) => new RMFPageGenerator(x, context))
      content.push(
        // packageJson,
        // api,
        route,
        navigation,
        app,
        ...pages
      )
    }

    const forms = views.map((x) => new RMFFormGenerator(x, context))
    content.push(...forms)

    return content
  }
}
