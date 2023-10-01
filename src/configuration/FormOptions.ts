import { OpenAPIV3 } from 'openapi-types'
import { ExtendedOperationObject } from '../openApi/ExtendedOperationObject'
import { FirstLowerCase, FirstUppercase } from '../utils/stringHelpers'

function getEntityName(path: string): string {
  return FirstUppercase(getEntityTypeName(path))
}

function getEntityTypeName(path: string): string {
  const name = path?.slice(path?.lastIndexOf('/') + 1) ?? 'Unknown'

  // this makes sure that e.g. 'Task-types' is converted to 'taskTypes'
  const parts = name.split('-')
  return [FirstLowerCase(parts[0]), parts.slice(1).map((x) => FirstUppercase(x))].join('')
}

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

  constructor(operation: ExtendedOperationObject) {
    const isCreateForm = operation.method === OpenAPIV3.HttpMethods.POST
    this.hasInitialValues = !isCreateForm
    const ref = (
      (operation.source.requestBody as OpenAPIV3.RequestBodyObject).content['application/json']
        .schema as OpenAPIV3.ReferenceObject
    ).$ref
    this.entityTypeName = getEntityTypeName(ref)
    this.entityName = getEntityName(operation.group)
    this.name = (isCreateForm ? 'Create' : 'Update') + this.entityName + 'Form'

    this.id = `${operation.method}-${operation.path.replace(/\//g, '-').replace(/\\/g, '-')}`
  }
}
