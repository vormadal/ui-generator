import { OpenAPIV2, OpenAPIV3 } from 'openapi-types'
import { CodeGenerator } from '../configuration/CodeGenerator'
import { View } from '../configuration/View'
import Endpoint from './Endpoint'
import { getEndpoints, getFormOptions, getSchemaComponents, getSchemaResolver } from './OpenApiFunctions'

export default class OpenApiSchema {
  private _views: View[] = []
  private _components: Map<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.RequestBodyObject> =
    new Map()

  public endpoints: Endpoint[]

  constructor(public openapiSpec: OpenAPIV3.Document, generator: CodeGenerator) {
    this._components = getSchemaComponents(this.openapiSpec)
    this.endpoints = getEndpoints(openapiSpec)
    this._views = getFormOptions(this.endpoints, getSchemaResolver(this._components), generator)

    const version = openapiSpec.openapi || (openapiSpec as unknown as OpenAPIV2.Document).swagger
    if (!version.startsWith('3.0')) {
      console.warn('unsupported OpenAPI version', version)
    }
  }

  get views(): View[] {
    return this._views
  }
}
