import { OpenAPIV3 } from 'openapi-types'
import { FirstUppercase } from '../../../utils/stringHelpers'
import { View } from '../../../configuration/View'

export function resolveViewName(view: View) {
  let prefix = ''

  let name = FirstUppercase(view.entityName)
  if (name.endsWith('Dto')) {
    name = name.substring(0, name.length - 3)
  }

  switch (view.endpoint.method) {
    case OpenAPIV3.HttpMethods.GET:
      prefix = view.isListView ? 'List' : 'Detail'
      break
    case OpenAPIV3.HttpMethods.POST:
      prefix = 'Create'
      break
    case OpenAPIV3.HttpMethods.PUT:
      prefix = 'Update'
      break
    default:
      prefix = view.endpoint.method.toLowerCase()
      break
  }
  if (name.startsWith(prefix)) prefix = ''

  return `${prefix}${name}`
}
