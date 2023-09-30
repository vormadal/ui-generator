import { OpenApiProperty } from '../openApi/OpenApiProperty'

export class FieldValidationOptions {
  isRequired: boolean

  constructor(property: OpenApiProperty) {
    this.isRequired = property.schema.required?.includes(property.name)
  }
}
