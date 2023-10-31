import { OpenAPIV3 } from 'openapi-types'

export default class Endpoint {
  constructor(
    public method: OpenAPIV3.HttpMethods, 
    public path: string, 
    public source: OpenAPIV3.OperationObject) {}
}
