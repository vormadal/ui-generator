import { ComponentImport } from './ComponentImport'
import { FieldOptions } from './FieldOptions'
import GeneratorContent from './GeneratorContent'

export interface FieldGenerator {
  get name(): string
  get imports(): ComponentImport[]
  generate(options: FieldOptions, indents: number): GeneratorContent[]
}
