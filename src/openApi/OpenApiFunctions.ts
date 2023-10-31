import { OpenAPIV3 } from 'openapi-types'
import { AnySchema, EndpointResolver, SchemaComponentMap, SchemaResolver } from './OpenApiTypes'
import Endpoint from './Endpoint'
import { CodeGenerator } from '../configuration/CodeGenerator'
import { FieldOptions } from '../configuration/FieldOptions'
import { View } from '../configuration/View'

export function resolveReferenceObject<T>(
  components: SchemaComponentMap,
  obj?: T | OpenAPIV3.ReferenceObject
): T | null {
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

export function getEndpointFields(
  endpoint: Endpoint,
  resolveSchema: SchemaResolver,
  generator: CodeGenerator
): FieldOptions[] {
  const requestBody = resolveSchema<OpenAPIV3.RequestBodyObject>(endpoint.source?.requestBody)
  if (!requestBody) return []

  const requestBodySchema = resolveSchema<OpenAPIV3.SchemaObject>(requestBody?.content['application/json']?.schema)

  if (requestBodySchema?.type !== 'object' || !requestBodySchema?.properties) {
    //TODO handle array and simple types or is this ever relevant?
    return []
  }

  const properties: FieldOptions[] = []
  for (const propName of Object.keys(requestBodySchema?.properties || {})) {
    const propertySchema = resolveSchema<OpenAPIV3.SchemaObject>(requestBodySchema?.properties[propName])

    if (generator.supportsField(propertySchema, endpoint)) {
      //TODO verify if type is correct
      properties.push(new FieldOptions(endpoint, propName, propertySchema, propertySchema.type))
    }
  }
  return properties
}

export function getSchemaComponents(spec: OpenAPIV3.Document): SchemaComponentMap {
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

export function getFormOptions(endpoints: Endpoint[], resolveSchema: SchemaResolver, generator: CodeGenerator): View[] {
  const views: View[] = []

  for (const endpoint of endpoints) {
    const fields = getEndpointFields(endpoint, resolveSchema, generator)
    if (generator.supportsView(endpoint)) {
      const view = new View(endpoint, fields, resolveSchema, generator)
      //TODO this is a temporary ugly fix
      if (view.entityTypeName !== 'Unknown') views.push(view)
    }
  }

  return views
}

export function getEndpoints(schema: OpenAPIV3.Document) {
  if (!schema?.paths) return

  const paths = Object.keys(schema.paths)
  const endpoints: Endpoint[] = []
  for (const path of paths) {
    const methods = Object.keys(schema.paths[path] || {}) as OpenAPIV3.HttpMethods[]

    for (const method of methods) {
      const source = schema.paths[path][method]
      endpoints.push(new Endpoint(method, path, source))
    }
  }

  return endpoints
}

export function getSchemaResolver(components: SchemaComponentMap): SchemaResolver {
  return function <T>(ref: OpenAPIV3.ReferenceObject | T) {
    return resolveReferenceObject<T>(components, ref)
  }
}

export function getEndpointResolver(endpoints: Endpoint[]): EndpointResolver {
  return function (method: OpenAPIV3.HttpMethods, path: string) {
    return endpoints.find((x) => x.method === method && x.path === path)
  }
}
