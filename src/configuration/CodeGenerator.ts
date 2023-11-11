import { OpenAPIV3 } from 'openapi-types'
import { View } from './View'
import GeneratorContent from './GeneratorContent'
import { Option } from './Option'
import ProjectConfiguration from '../system/ProjectConfiguration'
import Endpoint from '../openApi/Endpoint'
import OpenApiSchema from '../openApi/OpenApiSchema'

export interface CodeGenerator {
  /**
   * Unique name for this Generator
   */
  get name(): string

  generate(options: View[], viewOnly?: boolean, project?: ProjectConfiguration): GeneratorContent[]

  supportsView(endpoint: Endpoint): boolean
  supportsField(schema: OpenAPIV3.SchemaObject, endpoint: Endpoint): boolean

  getViewOptions(
    view: View,
    spec: OpenApiSchema
  ): Option[]
}
