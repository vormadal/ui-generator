import { OpenAPIV3 } from 'openapi-types'
import { ExtendedOperationObject } from './ExtendedOperationObject'
import { OpenApiProperty } from './OpenApiProperty'
import test from './test.json'

type SchemaComponentMap = Map<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.RequestBodyObject>

function stripUrlForPathParams(
  path: string,
  params?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]
): string {
  if (!params) return path

  let modifiedPath = path
  for (const param of params) {
    if ((param as OpenAPIV3.ParameterObject).in) {
      const paramObj = param as OpenAPIV3.ParameterObject
      if (paramObj.in === 'path') {
        modifiedPath = modifiedPath.replace(`/{${paramObj.name}}`, '')
      }
    }
  }
  return modifiedPath
}

function getOperations(
  schema: OpenAPIV3.Document,
  components: SchemaComponentMap,
  mediaType: string
): ExtendedOperationObject[] {
  if (!schema?.paths) return

  const paths = Object.keys(schema.paths)
  const endpoints: ExtendedOperationObject[] = []
  for (const path of paths) {
    const methods = Object.keys(schema.paths[path] || {}) as OpenAPIV3.HttpMethods[]
    endpoints.push(
      ...methods.map((x) => ({
        method: x,
        path: path,
        group: stripUrlForPathParams(path, schema.paths[path][x].parameters),
        source: schema.paths[path][x],
        properties: getOperationProperties(components, schema.paths[path][x], mediaType, path, x)
      }))
    )
  }

  return endpoints
}

function getOperationProperties(
  components: SchemaComponentMap,
  operation: OpenAPIV3.OperationObject,
  mediaType: string,
  path: string,
  method: OpenAPIV3.HttpMethods
): OpenApiProperty[] {
  const requestBody = getRequestBodyObject(components, operation?.requestBody)

  const properties: OpenApiProperty[] = []
  if (!requestBody) return []

  const content = getSchemaObject(components, requestBody.content[mediaType].schema)

  if (content?.type !== 'object' || !content?.properties) {
    //TODO handle array and simple types or is this ever relevant?
    return []
  }

  for (const propName of Object.keys(content?.properties || {})) {
    const prop = getSchemaObject(components, content?.properties[propName])

    if (prop.type) {
      properties.push(new OpenApiProperty(prop, propName, path, method))
    }
  }
  return properties
}

function getSchemaComponents(schema: OpenAPIV3.Document): SchemaComponentMap {
  const map: SchemaComponentMap = new Map()

  const schemaKeys = Object.keys(schema?.components?.schemas ?? {})
  const schemas = schema?.components?.schemas

  if (schemas) {
    for (const key of schemaKeys) {
      const schema = schemas[key]
      if (schema) {
        map.set(`#/components/schemas/${key}`, schema)
      }
    }
  }

  const requestBodyKeys = Object.keys(schema?.components?.requestBodies ?? {})
  const requestBodies = schema?.components?.requestBodies

  if (requestBodies) {
    for (const key of requestBodyKeys) {
      const requestBody = requestBodies[key]
      if (requestBody) {
        map.set(`#/components/requestBodies/${key}`, requestBody)
      }
    }
  }

  return map
}

function getSchemaObject(
  components: SchemaComponentMap,
  obj?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
): OpenAPIV3.SchemaObject | null {
  if (!obj) return null
  if ((obj as OpenAPIV3.ReferenceObject).$ref) {
    const ref = (obj as OpenAPIV3.ReferenceObject).$ref
    const component = components.get(ref)
    if ((component as OpenAPIV3.ReferenceObject).$ref) {
      return getSchemaObject(components, component as OpenAPIV3.ReferenceObject)
    }
    return component as OpenAPIV3.SchemaObject
  }
  return obj as OpenAPIV3.SchemaObject
}

function getRequestBodyObject(
  components: SchemaComponentMap,
  obj?: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject
): OpenAPIV3.RequestBodyObject | null {
  if (!obj) return null
  if ((obj as OpenAPIV3.ReferenceObject).$ref) {
    const ref = (obj as OpenAPIV3.ReferenceObject).$ref
    const component = components.get(ref)
    if ((component as OpenAPIV3.ReferenceObject).$ref) {
      return getRequestBodyObject(components, component as OpenAPIV3.ReferenceObject)
    }
    return component as OpenAPIV3.RequestBodyObject
  }
  return obj as OpenAPIV3.RequestBodyObject
}

export default class OpenApiSchema {
  private _formMethods = [OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.POST]
  //TODO we should probably support more than just json
  private _mediaType = 'application/json'

  private _data?: OpenAPIV3.Document = test as OpenAPIV3.Document
  private _paths: ExtendedOperationObject[] = []
  private _components: Map<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.RequestBodyObject> =
    new Map()

  constructor(openapiSpec: OpenAPIV3.Document) {
    this._data = openapiSpec
    this._components = getSchemaComponents(this._data)
    this._paths = getOperations(this._data, this._components, this._mediaType)
  }

  get paths(): ExtendedOperationObject[] {
    return this._paths
  }

  get components() {
    return this._components
  }

  get groupNames() {
    return [...new Set(this.paths.filter((x) => this.isValidForm(x)).map((x) => x.group))]
  }

  public getGroupItems(group: string): ExtendedOperationObject[] {
    if (!group) return []
    return this.paths.filter((x) => x.group === group && this.isValidForm(x))
  }

  isValidForm(operation?: ExtendedOperationObject) {
    if (!operation?.method || !this._formMethods.includes(operation?.method)) return false

    if (!operation.source?.requestBody) return false

    return true
  }
}
