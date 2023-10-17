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
}
