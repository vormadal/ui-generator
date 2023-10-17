import { OpenAPIV3 } from 'openapi-types'
import { FormOptions } from './FormOptions'
import GeneratorContent from './GeneratorContent'
import { OptionRenderer } from './OptionRenderer'

export interface CodeGenerator {
  /**
   * Unique name for this Generator
   */
  get name(): string
  get renderer(): OptionRenderer
  generate(options: FormOptions[]): GeneratorContent[]

  supportsView(method: OpenAPIV3.HttpMethods): boolean
  supportsField(type: OpenAPIV3.ArraySchemaObjectType | OpenAPIV3.NonArraySchemaObjectType): boolean
}
