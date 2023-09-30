import { TextFieldOptions } from '../../../configuration/TextFieldOptions'
import { OpenApiProperty } from '../../../openApi/OpenApiProperty'

export class RMFTextFieldOptions extends TextFieldOptions {
  doesItWork: boolean

  constructor(property: OpenApiProperty) {
    super(property)
  }
}
