import { OpenAPIV3 } from 'openapi-types'
import { ExtendedOperationObject } from './ExtendedOperationObject'
import { OpenApiProperty } from './OpenApiProperty'
import test from './test.json'
export default class OpenApiSchema {
  private _formMethods = [OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.POST]
  //TODO we should probably support more than just json
  private _mediaType = 'application/json'

  // private readonly _client = axios.create({
  //   // withCredentials: true,
  //   headers: {
  //     'Access-Control-Allow-Credentials': true
  //   }
  // })

  private _data?: OpenAPIV3.Document = test as OpenAPIV3.Document

  async load(url: string): Promise<void> {
    // const result = await this._client.get(url)
  }

  get groupNames() {
    return [...new Set(this.paths.filter((x) => this.isValidForm(x)).map((x) => x.group))]
  }

  getGroupItems(group: string): ExtendedOperationObject[] {
    if (!group) return []
    return this.paths.filter((x) => x.group === group && this.isValidForm(x))
  }

  isValidForm(operation?: ExtendedOperationObject) {
    if (!operation?.method || !this._formMethods.includes(operation?.method)) return false

    if (!operation.content?.requestBody) return false

    return true
  }

  getFormProperties(operation?: ExtendedOperationObject) {
    const requestBody = this.getRequestBodyObject(operation?.content?.requestBody)

    const properties: OpenApiProperty[] = []
    if (!requestBody) return []

    const content = this.getSchemaObject(requestBody.content[this._mediaType].schema)

    if (content?.type !== 'object' || !content?.properties) {
      //TODO handle array and simple types or is this ever relevant?
      return []
    }

    for (const propName of Object.keys(content?.properties || {})) {
      const prop = this.getSchemaObject(content?.properties[propName])

      if (prop.type) {
        properties.push(new OpenApiProperty(prop, propName, operation))
      }
    }
    return properties
  }

  getSchemaObject(obj?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): OpenAPIV3.SchemaObject | null {
    if (!obj) return null
    if ((obj as OpenAPIV3.ReferenceObject).$ref) {
      const ref = (obj as OpenAPIV3.ReferenceObject).$ref
      const component = this.components.get(ref)
      if ((component as OpenAPIV3.ReferenceObject).$ref) {
        return this.getSchemaObject(component as OpenAPIV3.ReferenceObject)
      }
      return component as OpenAPIV3.SchemaObject
    }
    return obj as OpenAPIV3.SchemaObject
  }

  getRequestBodyObject(
    obj?: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject
  ): OpenAPIV3.RequestBodyObject | null {
    if (!obj) return null
    if ((obj as OpenAPIV3.ReferenceObject).$ref) {
      const ref = (obj as OpenAPIV3.ReferenceObject).$ref
      const component = this.components.get(ref)
      if ((component as OpenAPIV3.ReferenceObject).$ref) {
        return this.getRequestBodyObject(component as OpenAPIV3.ReferenceObject)
      }
      return component as OpenAPIV3.RequestBodyObject
    }
    return obj as OpenAPIV3.RequestBodyObject
  }

  private stripParamaters(path: string, params?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]) {
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

  get paths(): ExtendedOperationObject[] {
    if (!this._data?.paths) return []

    const paths = Object.keys(this._data.paths)

    const endpoints = []
    for (const path of paths) {
      const methods = Object.keys(this._data.paths[path] || {}) as OpenAPIV3.HttpMethods[]
      endpoints.push(
        ...methods.map((x) => ({
          method: x,
          path: path,
          group: this.stripParamaters(path, this._data.paths[path][x].parameters),
          content: this._data.paths[path][x],
          schema: this
        }))
      )
    }

    return endpoints
  }

  get components() {
    const map: Map<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.RequestBodyObject> = new Map()

    const schemaKeys = Object.keys(this._data?.components?.schemas ?? {})
    const schemas = this._data?.components?.schemas

    if (schemas) {
      for (const key of schemaKeys) {
        const schema = schemas[key]
        if (schema) {
          map.set(`#/components/schemas/${key}`, schema)
        }
      }
    }

    const requestBodyKeys = Object.keys(this._data?.components?.requestBodies ?? {})
    const requestBodies = this._data?.components?.requestBodies

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
}
