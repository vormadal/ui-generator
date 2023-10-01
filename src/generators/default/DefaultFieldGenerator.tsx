import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import GeneratorContent from '../../configuration/GeneratorContent'

export default class DefaultFieldGenerator implements FieldGenerator {
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
