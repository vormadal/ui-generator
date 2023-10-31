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
  entityTypeName: string
  entityName: string
  /**
   * Name of the property of type 'entityTypeName' used for e.g. parameter name in submit function.
   * Usually the same as entity name but with the first letter as lowercase
   */
  public entityPropertyName: string

  public isCreateForm: boolean
  public isUpdateForm: boolean
  public isListView: boolean
  public isDetailsView: boolean

  public hasInitialValues: boolean

  public group: string
  public entityImportPath = '../api'

  public parameters: OpenAPIV3.ParameterObject[]

  public getOperationName = 'Unknown'

  /**
   * these are the options the user can change.
   * Furthermore the generator can add additional options
   */
  public options: Option[] = []

  constructor(
    public path: string,
    public method: OpenAPIV3.HttpMethods,
    public source: OpenAPIV3.OperationObject,
    public fields: Field[],
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

    this.options = generator.getViewOptions(path, method, this.entityName, content) || []

    this.entityPropertyName = FirstLowerCase(this.entityName.replace('Dto', ''))
    this.isCreateForm = this.method === OpenAPIV3.HttpMethods.POST
    this.isUpdateForm = this.method === OpenAPIV3.HttpMethods.PUT
    this.isDetailsView = this.method === OpenAPIV3.HttpMethods.GET //TODO
    this.isListView = this.method === OpenAPIV3.HttpMethods.GET //TODO
    this.hasInitialValues = !this.isCreateForm
  }

  getOption = <T = string>(name: string): T => {
    return this.options.find((x) => x.name === name).value
  }
}
