import { ExtendedOperationObject } from '../openApi/ExtendedOperationObject'
import { OpenApiProperty } from '../openApi/OpenApiProperty'
import { FieldOptions } from './FieldOptions'
import { FormOptions } from './FormOptions'
import GeneratorContent from './GeneratorContent'
import { GeneratorOptions } from './GeneratorOptions'
import { OptionRenderer } from './OptionRenderer'

export interface CodeGenerator {
  /**
   * Unique name for this Generator
   */
  get name(): string
  get renderer(): OptionRenderer
  generate(options: GeneratorOptions): GeneratorContent[]

  createFieldOptions(property: OpenApiProperty): FieldOptions
  createFormOptions(schema: ExtendedOperationObject): FormOptions
}
