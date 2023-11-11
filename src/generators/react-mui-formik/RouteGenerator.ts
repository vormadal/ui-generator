import { View } from '../../configuration/View'
import GeneratorContent, { GeneratorContentType } from '../../configuration/GeneratorContent'
import { OpenAPIV3 } from 'openapi-types'

export interface RMFRoute {
  path: string
  pageName: string
  parameters: OpenAPIV3.ParameterObject[]
}
export default class RouteGenerator implements GeneratorContent {
  constructor(public readonly views: View[]) {}

  get type(): GeneratorContentType {
    return 'file'
  }

  get directory(): string {
    return 'src'
  }

  get name(): string {
    return 'AppRoutes'
  }

  get filename(): string {
    return `${this.directory}/${this.name}.tsx`
  }

  getRoutes = (views: View[]): RMFRoute[] => {
    return views.map((x) => ({
      path: `${x.getOption('route')}/${x.endpoint.method}`,
      pageName: x.getOption('pageName'),
      parameters: x.parameters
    }))
  }

  generate = (): Promise<string> => {
    const routes = this.getRoutes(this.views)
    const imports = [
      `import { Route, Routes } from 'react-router-dom'`,
      ...routes.map((x) => `import ${x.pageName} from './pages/${x.pageName}'`)
    ].join('\n')

    const routeComponents = routes
      .map((x) => [`<Route`, `   path="${x.path}"`, `   element={<${x.pageName} />}`, `/>`].join('\n\t\t\t\t'))
      .join('\n\t\t\t')

    return Promise.resolve(`${imports}

function ${this.name}() {
  return (
      <Routes>
        ${routeComponents}
      </Routes>
  )
}

export default ${this.name}
    `)
  }
}
