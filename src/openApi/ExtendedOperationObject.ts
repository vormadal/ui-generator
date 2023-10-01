import { OpenAPIV3 } from 'openapi-types'
import { OpenApiProperty } from './OpenApiProperty'

export interface ExtendedOperationObject {
  source: OpenAPIV3.OperationObject | undefined

  method: OpenAPIV3.HttpMethods
  path: string
  group: string

  properties: OpenApiProperty[]
}
