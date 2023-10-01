import { OpenApiProperty } from '../openApi/OpenApiProperty'

export class FieldValidationOptions {
  isRequired: boolean

  constructor(property: OpenApiProperty) {
    this.isRequired = property.source.required?.includes(property.name)
  }
}
