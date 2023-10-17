import { OpenAPIV3 } from 'openapi-types'
import { FirstLowerCase, FirstUppercase, stripPathParams } from '../utils/stringHelpers'
import { FieldOptions } from './FieldOptions'

function getEntityName(path: string): string {
  const name = path?.slice(path?.lastIndexOf('/') + 1) ?? 'Unknown'

  // this makes sure that e.g. 'Task-types' is converted to 'taskTypes'
  const parts = name.split('-')
  return [FirstLowerCase(parts[0]), parts.slice(1).map((x) => FirstUppercase(x))].join('')
}

function getEntityTypeName(path: string): string {
  return FirstUppercase(getEntityName(path))
}

/**
 * This can be options
 * 1: a create from or
 * 2: update form as well as
 * 3: a list view or
 * 4: detailed view of a single record
 */
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
    //TODO can we make this smarter?
    return FirstLowerCase(this.entityName.replace('Dto', ''))
  }

  get isCreateForm() {
    return this.method === OpenAPIV3.HttpMethods.POST
  }

  get hasInitialValues() {
    return !this.isCreateForm
  }

  public readonly group: string
  public readonly entityImportPath = '../api'

  public readonly parameters: OpenAPIV3.ParameterObject[]

  constructor(
    public readonly path: string,
    public readonly method: OpenAPIV3.HttpMethods,
    public readonly source: OpenAPIV3.OperationObject,
    public readonly fieldOptions: FieldOptions[],
    resolveReference: <T>(ref: OpenAPIV3.ReferenceObject | T) => T | null
  ) {
    this.group = stripPathParams(path)
    this.parameters = source.parameters?.map((x) => resolveReference<OpenAPIV3.ParameterObject>(x)) ?? []
    const response = resolveReference<OpenAPIV3.ResponseObject>(source.responses && source.responses[200])
    const responseRef = response.content && response.content['application/json']
    const responseContent = resolveReference<OpenAPIV3.SchemaObject>(responseRef)

    const ref =
      (source.requestBody as OpenAPIV3.ReferenceObject)?.$ref ??
      (responseRef?.schema as OpenAPIV3.ReferenceObject)?.$ref

    this.entityTypeName = getEntityTypeName(ref)
    this.entityName = getEntityName(ref)

    this.name = resolveViewName(method, this.entityName, responseContent)

    this.id = `${method}:${path}`
  }
}

function resolveViewName(method: OpenAPIV3.HttpMethods, entityName: string, responseContent: OpenAPIV3.SchemaObject) {
  let prefix = ''
  let suffix = ''
  switch (method) {
    case OpenAPIV3.HttpMethods.GET:
      prefix = responseContent.type == 'array' ? 'List' : 'Detail'
      suffix = 'View'
      break
    case OpenAPIV3.HttpMethods.POST:
      prefix = 'Create'
      suffix = 'Form'
      break
    case OpenAPIV3.HttpMethods.PUT:
      prefix = 'Update'
      suffix = 'Form'
      break
    default:
      prefix = method.toLowerCase()
      suffix = 'View'
      break
  }

  let name = FirstUppercase(entityName)
  if (name.endsWith('Dto')) {
    name = name.substring(0, name.length - 3)
  }

  return `${prefix}${name}${suffix}`
}
