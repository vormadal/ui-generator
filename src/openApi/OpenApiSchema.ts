import { OpenAPIV2, OpenAPIV3 } from 'openapi-types'
import { FieldOptions } from '../configuration/FieldOptions'
import { View } from '../configuration/FormOptions'
import test from './test.json'
import { CodeGenerator } from '../configuration/CodeGenerator'

type AnySchema = OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.RequestBodyObject
type SchemaComponentMap = Map<string, AnySchema>

function getFormOptions(
  schema: OpenAPIV3.Document,
  components: SchemaComponentMap,
  generator: CodeGenerator
): View[] {
  if (!schema?.paths) return

  const paths = Object.keys(schema.paths)
  const endpoints: View[] = []
  for (const path of paths) {
    const methods = Object.keys(schema.paths[path] || {}) as OpenAPIV3.HttpMethods[]

    for (const method of methods) {
      const source = schema.paths[path][method]
      const properties = getOperationProperties(components, source, path, method, generator)
      const resolveReference = <T>(ref: OpenAPIV3.ReferenceObject | T) => resolveReferenceObject<T>(components, ref)
      if (generator.supportsView(method)) {
        const form = new View(path, method, source, properties, resolveReference, generator)
        //TODO this is a temporary ugly fix
        if (form.entityTypeName !== 'Unknown') endpoints.push(form)
      }
    }
  }

  return endpoints
}

function getOperationProperties(
  components: SchemaComponentMap,
  operation: OpenAPIV3.OperationObject,
  path: string,
  method: OpenAPIV3.HttpMethods,
  generator: CodeGenerator
): FieldOptions[] {
  const requestBody = resolveReferenceObject<OpenAPIV3.RequestBodyObject>(components, operation?.requestBody)
  if (!requestBody) return []

  const content = resolveReferenceObject<OpenAPIV3.SchemaObject>(
    components,
    requestBody?.content['application/json']?.schema
  )

  if (content?.type !== 'object' || !content?.properties) {
    //TODO handle array and simple types or is this ever relevant?
    return []
  }

  const properties: FieldOptions[] = []
  for (const propName of Object.keys(content?.properties || {})) {
    const prop = resolveReferenceObject<OpenAPIV3.SchemaObject>(components, content?.properties[propName])

    if (generator.supportsField(prop.type)) {
      //TODO verify if type is correct
      properties.push(new FieldOptions(path, method, propName, prop, prop.type))
    }
  }
  return properties
}

function getSchemaComponents(spec: OpenAPIV3.Document): SchemaComponentMap {
  const map: SchemaComponentMap = new Map()

  function resolveReferences(schemas: { [key: string]: AnySchema }, prefix: string) {
    const keys = Object.keys(schemas ?? {})
    if (!schemas) return
    for (const key of keys) {
      const schema = schemas[key]
      if (schema) {
        map.set(`${prefix}${key}`, schema)
      }
    }
  }

  resolveReferences(spec?.components?.schemas, '#/components/schemas/')
  resolveReferences(spec?.components?.requestBodies, '#/components/requestBodies/')
  resolveReferences(spec?.components?.responses, '#/components/responses')

  return map
}

function resolveReferenceObject<T>(components: SchemaComponentMap, obj?: T | OpenAPIV3.ReferenceObject): T | null {
  if (!obj) return null
  if ((obj as OpenAPIV3.ReferenceObject).$ref) {
    const ref = (obj as OpenAPIV3.ReferenceObject).$ref
    const component = components.get(ref)
    if ((component as OpenAPIV3.ReferenceObject).$ref) {
      return resolveReferenceObject<T>(components, component as OpenAPIV3.ReferenceObject)
    }
    return component as T
  }
  return obj as T
}

export default class OpenApiSchema {
  private _formMethods = [OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.POST]
  
  private _data?: OpenAPIV3.Document = test as OpenAPIV3.Document
  private _paths: View[] = []
  private _components: Map<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.RequestBodyObject> =
    new Map()

  constructor(openapiSpec: OpenAPIV3.Document, generator: CodeGenerator) {
    this._data = openapiSpec
    this._components = getSchemaComponents(this._data)
    this._paths = getFormOptions(this._data, this._components, generator)

    const version = openapiSpec.openapi || (openapiSpec as unknown as OpenAPIV2.Document).swagger
    if (!version.startsWith('3.0')) {
      
      console.warn('unsupported OpenAPI version', version)
    }
  }

  get paths(): View[] {
    return this._paths
  }

  get components() {
    return this._components
  }

  get groupNames() {
    return [...new Set(this.paths.filter((x) => this.isValidForm(x)).map((x) => x.group))]
  }

  public getGroupItems(group: string): View[] {
    if (!group) return []
    return this.paths.filter((x) => x.group === group && this.isValidForm(x))
  }

  isValidForm(form?: View) {
    if (!form?.method || !this._formMethods.includes(form?.method)) return false

    if (!form.source?.requestBody) return false

    return true
  }
}
