import { OpenAPIV3 } from 'openapi-types'
import { ExtendedOperationObject } from './ExtendedOperationObject'

export class OpenApiProperty {
  constructor(
    public readonly schema: OpenAPIV3.SchemaObject,
    public readonly name: string,
    public readonly operation: ExtendedOperationObject
  ) {}

  get type() {
    return this.schema.type as OpenAPIV3.NonArraySchemaObjectType
  }
}
