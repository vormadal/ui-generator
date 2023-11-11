import GeneratorContent, { GeneratorContentType } from '../../configuration/GeneratorContent'
import { View } from '../../configuration/View'
import ProjectConfiguration from '../../system/ProjectConfiguration'
import RouteGenerator from './RouteGenerator'
import { NavigationTemplate } from './templates/app/Navigation'

export default class NavigationGenerator implements GeneratorContent {
  constructor(public views: View[], public routeGenerator: RouteGenerator, public project: ProjectConfiguration) {}

  get type(): GeneratorContentType {
    return 'file'
  }

  get directory() {
    return 'src'
  }

  get name() {
    return 'Navigation'
  }

  get filename() {
    return `${this.directory}/${this.name}.tsx`
  }

  generate = async (): Promise<string> => {
    // choose only routes that do not require any parameters in the url
    const routes = this.routeGenerator.getRoutes(this.views).filter((x) => !x.parameters?.length)
    return NavigationTemplate(this.name, this.project, routes)
  }
}
