import { OpenApiProperty } from '../openApi/OpenApiProperty'
import { FieldValidationOptions } from './FieldValidationOptions'

export class TextFieldValidationOptions extends FieldValidationOptions {
  minLength: number
  maxLength: number

  constructor(property: OpenApiProperty) {
    super(property)
  }
}
