import { OpenAPIV3 } from 'openapi-types'
import { FirstUppercase } from '../../../utils/stringHelpers'

export function resolveViewName(method: OpenAPIV3.HttpMethods, entityName: string, content: OpenAPIV3.SchemaObject) {
  let prefix = ''

  let name = FirstUppercase(entityName)
  if (name.endsWith('Dto')) {
    name = name.substring(0, name.length - 3)
  }

  switch (method) {
    case OpenAPIV3.HttpMethods.GET:
      prefix = content.type == 'array' ? 'List' : 'Detail'
      break
    case OpenAPIV3.HttpMethods.POST:
      prefix = 'Create'
      break
    case OpenAPIV3.HttpMethods.PUT:
      prefix = 'Update'
      break
    default:
      prefix = method.toLowerCase()
      break
  }
  if (name.startsWith(prefix)) prefix = ''

  return `${prefix}${name}`
}
