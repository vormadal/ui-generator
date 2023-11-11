import { OpenAPIV3 } from 'openapi-types'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import { View } from '../../configuration/View'
import ProjectConfiguration from '../../system/ProjectConfiguration'
import DefaultFieldGenerator from '../default/DefaultFieldGenerator'
import ApiGenerator from './ApiGenerator'
import RouteGenerator from './RouteGenerator'

export class RMFContext {
  constructor(
    private readonly _fieldGenerators: FieldGenerator[],
    public readonly views: View[],
    public readonly project: ProjectConfiguration
  ) {}

  public apiGenerator: ApiGenerator
  public routeGenerator: RouteGenerator

  getFieldGenerator(options: FieldOptions): FieldGenerator {
    return this._fieldGenerators.find((x) => x.isSupporting(options.schema)) || new DefaultFieldGenerator()
  }

  getViewByPath(path: string, method: OpenAPIV3.HttpMethods, includeIdParam: boolean): View {
    if (includeIdParam) {
      return this.views.find((x) => x.endpoint.path.startsWith(path) && x.endpoint.path.includes(`{id}`) && x.endpoint.method === method)
    }
    return this.views.find((x) => x.endpoint.path === path && x.endpoint.method === method)
  }
}
