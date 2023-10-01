import { OpenAPIV3 } from 'openapi-types'
import { OpenApiProperty } from '../openApi/OpenApiProperty'
import { FirstUppercase } from '../utils/stringHelpers'

export class FieldOptions {
  id: string
  name: string
  label: string
  ignore: boolean

  constructor(
    protected readonly property: OpenApiProperty,
    public readonly type: OpenAPIV3.NonArraySchemaObjectType | 'unknown'
  ) {
    this.id = `${property.method}-${property.path}-${property.name}`
    this.name = property.name
    this.label = FirstUppercase(property.name)
    this.ignore = ['_id', 'id'].includes(property.name)
  }
}
