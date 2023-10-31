import { OpenAPIV3 } from 'openapi-types'
import { View } from './FormOptions'
import GeneratorContent from './GeneratorContent'
import { Option } from './Option'
import ProjectConfiguration from '../system/ProjectConfiguration'

export interface CodeGenerator {
  /**
   * Unique name for this Generator
   */
  get name(): string

  generate(options: View[], viewOnly?: boolean, project?: ProjectConfiguration): GeneratorContent[]

  supportsView(method: OpenAPIV3.HttpMethods): boolean
  supportsField(schema: OpenAPIV3.SchemaObject): boolean

  getViewOptions(path: string, method: OpenAPIV3.HttpMethods, entityName: string, content: OpenAPIV3.SchemaObject): Option[]
}
