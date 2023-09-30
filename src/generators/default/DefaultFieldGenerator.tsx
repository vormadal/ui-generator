import { Alert } from '@mui/material'
import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import { OpenApiProperty } from '../../openApi/OpenApiProperty'

export default class DefaultFieldGenerator implements FieldGenerator {
  constructor(private readonly property: OpenApiProperty) {}
  get options(): FieldOptions {
    return new FieldOptions(this.property, 'unknown')
  }
  get name(): string {
    return 'default'
  }

  get imports(): ComponentImport[] {
    return []
  }

  Component = () => {
    return <Alert severity="error">The property type '{this.property.type}' is not supported</Alert>
  }

  generate(): string {
    return ''
  }
}
