import { OpenAPIV3 } from 'openapi-types'
import OpenApiSchema from '../openApi/OpenApiSchema'

export default class ProjectConfiguration {
  id = `${Date.now()}`
  name = 'New project'
  projectDirectory: string
  openapiSpecPath: string
  selectedGenerator: string
  schema: OpenApiSchema
  spec: OpenAPIV3.Document
}
