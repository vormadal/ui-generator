import { OpenApiProperty } from '../openApi/OpenApiProperty'
import { FieldOptions } from './FieldOptions'

export class UnknownFieldOptions extends FieldOptions {
  constructor(property: OpenApiProperty) {
    super(property, 'unknown')
  }
}
