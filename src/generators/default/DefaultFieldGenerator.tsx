import { OpenAPIV3 } from 'openapi-types'
import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import GeneratorContent from '../../configuration/GeneratorContent'

export default class DefaultFieldGenerator implements FieldGenerator {
  isSupporting(options: OpenAPIV3.SchemaObject): boolean {
    return true
  }
  get name(): string {
    return 'default'
  }

  get imports(): ComponentImport[] {
    return []
  }

  generate(): GeneratorContent[] {
    return [new GeneratorContent('partial', '')]
  }
}
