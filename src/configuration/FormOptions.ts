import { OpenAPIV3 } from 'openapi-types'
import { FirstLowerCase, FirstUppercase, stripPathParams } from '../utils/stringHelpers'
import { FieldOptions as Field } from './FieldOptions'
import { Option } from './Option'
import { CodeGenerator } from './CodeGenerator'

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
export class View {
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

  /**
   * these are the options the user can change.
   * Furthermore the generator can add additional options
   */
  public readonly options: Option[] = []

  constructor(
    public readonly path: string,
    public readonly method: OpenAPIV3.HttpMethods,
    public readonly source: OpenAPIV3.OperationObject,
    public readonly fields: Field[],
    resolveReference: <T>(ref: OpenAPIV3.ReferenceObject | T) => T | null,
    generator: CodeGenerator
  ) {
    this.group = stripPathParams(path)
    this.parameters = source.parameters?.map((x) => resolveReference<OpenAPIV3.ParameterObject>(x)) ?? []

    const response = resolveReference<OpenAPIV3.ResponseObject>(source.responses && source.responses[200])
    const responseRef = response?.content && response.content['application/json']
    const responseContent = resolveReference<OpenAPIV3.SchemaObject>(responseRef)

    const request = resolveReference<OpenAPIV3.RequestBodyObject>(source.requestBody)
    const requestRef = request?.content && request.content['application/json']
    const requestContent = resolveReference<OpenAPIV3.SchemaObject>(requestRef)

    let ref = (responseRef?.schema as OpenAPIV3.ReferenceObject)?.$ref
    let content = responseContent

    if ([OpenAPIV3.HttpMethods.POST, OpenAPIV3.HttpMethods.PUT].includes(method)) {
      ref = (requestRef?.schema as OpenAPIV3.ReferenceObject)?.$ref
      content = requestContent
    }

    this.entityTypeName = getEntityTypeName(ref)
    this.entityName = getEntityName(ref)
    this.id = `${method}:${path}`

    this.options = generator.getViewOptions(method, this.entityName, content) || []
  }

  getOption = <T = string>(name: string): T => {
    return this.options.find((x) => x.name === name).value
  }
}
