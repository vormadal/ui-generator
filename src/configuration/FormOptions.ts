import { OpenAPIV3 } from 'openapi-types'
import { ExtendedOperationObject } from '../openApi/ExtendedOperationObject'
import { FirstLowerCase, FirstUppercase } from '../utils/stringHelpers'

export class FormOptions {
  id: string
  name: string

  entityTypeName: string
  entityName: string
  /**
   * Name of the property of type 'entityTypeName' used for e.g. parameter name in submit function.
   * Usually the same as entity name but with the first letter as lowercase
   */
  get entityPropertyName() {
    return FirstLowerCase(this.entityName)
  }

  entityImportPath = '../../api'
  hasInitialValues: boolean

  constructor(private readonly operation: ExtendedOperationObject) {
    const isCreateForm = operation.method === OpenAPIV3.HttpMethods.POST
    this.hasInitialValues = !isCreateForm
    const ref = (
      (operation.content.requestBody as OpenAPIV3.RequestBodyObject).content['application/json']
        .schema as OpenAPIV3.ReferenceObject
    ).$ref
    this.entityTypeName = ref?.slice(ref?.lastIndexOf('/') + 1) ?? 'Unknown'
    this.entityName = FirstUppercase(operation.group.slice(operation.group.lastIndexOf('/') + 1))
    this.name = (isCreateForm ? 'Create' : 'Update') + this.entityName + 'Form'

    this.id = `${operation.method}-${operation.path.replace(/\//g, '-').replace(/\\/g, '-')}`
  }
}
