import { OpenAPIV3 } from 'openapi-types'
import { FirstUppercase } from '../utils/stringHelpers'

export class FieldOptions {
  label: string
  ignore: boolean
  isRequired: boolean

  get id() {
    return `${this.method}-${this.path}-${this.name}`
  }

  constructor(
    public path: string,
    public method: OpenAPIV3.HttpMethods,
    public name: string,
    public source: OpenAPIV3.SchemaObject,
    public type: OpenAPIV3.ArraySchemaObjectType | OpenAPIV3.NonArraySchemaObjectType | 'unknown'
  ) {
    this.label = FirstUppercase(name)
    this.ignore = ['_id', 'id'].includes(name)
    this.isRequired = (source.required || []).includes(name)
  }
}
