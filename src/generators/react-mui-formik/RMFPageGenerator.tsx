import { OpenAPIV3 } from 'openapi-types'
import { ComponentImport } from '../../configuration/ComponentImport'
import GeneratorContent, { GeneratorContentType } from '../../configuration/GeneratorContent'
import { View } from '../../configuration/View'
import { RMFContext } from './RMFContext'
import { createPageTemplate } from './templates/create/CreatePage'
import { updatePageTemplate } from './templates/update/UpdatePage'
import { detailsPageTemplate } from './templates/view/DetailsPage'

type PageTemplateType = {
  [key: string]: (view: View, ctx: RMFContext) => string
}

const pageTemplates: PageTemplateType = {
  [OpenAPIV3.HttpMethods.POST]: createPageTemplate,
  [OpenAPIV3.HttpMethods.PUT]: updatePageTemplate,
  [OpenAPIV3.HttpMethods.GET]: detailsPageTemplate
}
export default class RMFPageGenerator implements GeneratorContent {
  constructor(private readonly view: View, private readonly ctx: RMFContext) {}

  get type(): GeneratorContentType {
    return 'file'
  }

  get directory() {
    return 'src/pages'
  }

  get name() {
    return this.view.getOption('pageName')
  }

  get filename() {
    return `${this.directory}/${this.name}.tsx`
  }

  generate = async (): Promise<string> => {
    return pageTemplates[this.view.endpoint.method](this.view, this.ctx)
  }
}
