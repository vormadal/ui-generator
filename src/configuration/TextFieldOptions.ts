import { OpenApiProperty } from '../openApi/OpenApiProperty'
import { FieldOptions } from './FieldOptions'
import { TextFieldValidationOptions } from './TextFieldValidationOptions'

export class TextFieldOptions extends FieldOptions {
  validation: TextFieldValidationOptions

  constructor(property: OpenApiProperty) {
    super(property, property.type)
    this.validation = new TextFieldValidationOptions(property)
  }
}
