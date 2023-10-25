import { OpenAPIV3 } from 'openapi-types'
import { View } from './FormOptions'
import GeneratorContent from './GeneratorContent'
import { Option } from './Option'

export interface CodeGenerator {
  /**
   * Unique name for this Generator
   */
  get name(): string

  generate(options: View[]): GeneratorContent[]

  supportsView(method: OpenAPIV3.HttpMethods): boolean
  supportsField(type: OpenAPIV3.ArraySchemaObjectType | OpenAPIV3.NonArraySchemaObjectType): boolean

  getViewOptions(method: OpenAPIV3.HttpMethods, entityName: string, content: OpenAPIV3.SchemaObject): Option[]
}
