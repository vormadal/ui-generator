import { OpenAPIV3 } from 'openapi-types'
import OpenApiSchema from './OpenApiSchema'

export interface ExtendedOperationObject {
  method: OpenAPIV3.HttpMethods
  content: OpenAPIV3.OperationObject | undefined
  path: string
  group: string
  schema: OpenApiSchema
}
