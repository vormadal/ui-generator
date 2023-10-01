import { ComponentImport } from './ComponentImport'
import { FieldOptions } from './FieldOptions'

export interface FieldGenerator {
  get name(): string
  get imports(): ComponentImport[]
  generate(options: FieldOptions): string
}
