import { OpenAPIV3 } from 'openapi-types'
import { FirstUppercase } from '../utils/stringHelpers'
import Endpoint from '../openApi/Endpoint'

export class FieldOptions {
  label: string
  ignore: boolean
  isRequired: boolean

  get id() {
    return `${this.endpoint.method}-${this.endpoint.path}-${this.name}`
  }

  constructor(
    public endpoint: Endpoint,
    public name: string,
    public schema: OpenAPIV3.SchemaObject,
    public type: OpenAPIV3.ArraySchemaObjectType | OpenAPIV3.NonArraySchemaObjectType | 'unknown'
  ) {
    this.label = FirstUppercase(name)
    this.ignore = ['_id', 'id'].includes(name)
    this.isRequired = (schema.required || []).includes(name)
  }
}
