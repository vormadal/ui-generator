import { OpenAPIV3 } from 'openapi-types'
import { ComponentImport } from './ComponentImport'
import { FieldOptions } from './FieldOptions'

export interface FieldGenerator {
  get name(): string
  get imports(): ComponentImport[]
  generate(options: FieldOptions, indents: number): string

  isSupporting(schema: OpenAPIV3.SchemaObject): boolean
}
