import { OpenAPIV3 } from 'openapi-types'
import Endpoint from '../openApi/Endpoint'
import OpenApiSchema from '../openApi/OpenApiSchema'
import { FirstLowerCase, FirstUppercase, stripPathParams } from '../utils/stringHelpers'
import { FieldOptions as Field } from './FieldOptions'
import { Option } from './Option'

function getEntityName(path: string): string {
  const name = path?.slice(path?.lastIndexOf('/') + 1) ?? 'Unknown'

  // this makes sure that e.g. 'Task-types' is converted to 'taskTypes'
  const parts = name.split('-')
  return [FirstLowerCase(parts[0]), parts.slice(1).map((x) => FirstUppercase(x))].join('')
}

function getEntityTypeName(path: string): string {
  return FirstUppercase(getEntityName(path))
}

function resolveRef(ref?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): string {
  if (!ref) return ''
  let refObj = ref
  if ((ref as OpenAPIV3.SchemaObject).type === 'array') {
    refObj = (ref as OpenAPIV3.ArraySchemaObject).items
  }

  // TODO - currently we assume this is always a reference object not a schema object
  return (refObj as OpenAPIV3.ReferenceObject)?.$ref
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

  /**
   * these are the options the user can change.
   * Furthermore the generator can add additional options
   */
  public options: Option[] = []

  constructor(public endpoint: Endpoint, public fields: Field[], spec: OpenApiSchema) {
    this.group = stripPathParams(endpoint.path)
    this.parameters = endpoint.source.parameters?.map((x) => spec.resolveReference<OpenAPIV3.ParameterObject>(x)) ?? []

    const response = spec.resolveReference<OpenAPIV3.ResponseObject>(
      endpoint.source.responses && endpoint.source.responses[200]
    )
    const responseRef = response?.content && response.content['application/json']
    const responseSchema = spec.resolveReference<OpenAPIV3.SchemaObject>(responseRef)

    const request = spec.resolveReference<OpenAPIV3.RequestBodyObject>(endpoint.source.requestBody)
    const requestRef = request?.content && request.content['application/json']
    const requestSchema = spec.resolveReference<OpenAPIV3.SchemaObject>(requestRef)

    let ref = resolveRef(responseRef?.schema)
    let schema = responseRef?.schema

    if ([OpenAPIV3.HttpMethods.POST, OpenAPIV3.HttpMethods.PUT].includes(endpoint.method)) {
      ref = resolveRef(requestRef?.schema)
      schema = requestRef?.schema
    }

    this.isListView = (schema as OpenAPIV3.ArraySchemaObject).type === 'array' //TODO
    this.entityTypeName = getEntityTypeName(ref)
    this.entityName = getEntityName(ref)
    this.id = `${endpoint.method}:${endpoint.path}`

    this.entityPropertyName = FirstLowerCase(this.entityName.replace('Dto', ''))
    this.isCreateForm = this.endpoint.method === OpenAPIV3.HttpMethods.POST
    this.isUpdateForm = this.endpoint.method === OpenAPIV3.HttpMethods.PUT
    this.isDetailsView = this.endpoint.method === OpenAPIV3.HttpMethods.GET //TODO
    
    this.hasInitialValues = !this.isCreateForm

    this.options = spec.generator.getViewOptions(this, spec) || []
  }

  getOption = <T = string>(name: string): T => {
    return this.options.find((x) => x.name === name)?.value
  }
}
