import { OpenAPIV3 } from 'openapi-types'

export class OpenApiProperty {
  constructor(
    public readonly source: OpenAPIV3.SchemaObject,
    public readonly name: string,
    public readonly path: string,
    public readonly method: OpenAPIV3.HttpMethods
  ) {}

  get type() {
    return this.source.type as OpenAPIV3.NonArraySchemaObjectType
  }
}
