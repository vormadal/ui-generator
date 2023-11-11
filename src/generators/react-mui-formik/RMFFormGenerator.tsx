import { OpenAPIV3 } from 'openapi-types'
import GeneratorContent, { GeneratorContentType } from '../../configuration/GeneratorContent'
import { View } from '../../configuration/View'
import { RMFContext } from './RMFContext'
import { createFormTeplate as createFormTemplate } from './templates/create/CreateForm'
import { updateFormTeplate as updateFormTemplate } from './templates/update/UpdateForm'
import { detailsViewTemplate } from './templates/view/DetailsView'

type ViewTemplateType = {
  [key: string]: (view: View, ctx: RMFContext) => string
}

const viewTemplates: ViewTemplateType = {
  [OpenAPIV3.HttpMethods.POST]: createFormTemplate,
  [OpenAPIV3.HttpMethods.PUT]: updateFormTemplate,
  [OpenAPIV3.HttpMethods.GET]: detailsViewTemplate
}

export default class RMFFormGenerator implements GeneratorContent {
  constructor(private readonly view: View, private readonly ctx: RMFContext) {}

  get type(): GeneratorContentType {
    return 'file'
  }

  get directory() {
    return 'src/components'
  }

  get name() {
    return this.view.getOption('name')
  }

  get filename() {
    return `${this.directory}/${this.name}.tsx`
  }

  generate = async (): Promise<string> => {
    return viewTemplates[this.view.endpoint.method](this.view, this.ctx)
  }
}
