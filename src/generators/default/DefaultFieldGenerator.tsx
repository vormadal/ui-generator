import { Alert } from '@mui/material'
import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import { OpenApiProperty } from '../../openApi/OpenApiProperty'

export default class DefaultFieldGenerator implements FieldGenerator {
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
