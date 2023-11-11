import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'

export default class DefaultFieldGenerator implements FieldGenerator {
  isSupporting(): boolean {
    return true
  }
  get name(): string {
    return 'default'
  }

  get imports(): ComponentImport[] {
    return []
  }

  generate(): string {
    return ''
  }
}
