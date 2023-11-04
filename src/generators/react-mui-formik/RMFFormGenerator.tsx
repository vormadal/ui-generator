import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import { View } from '../../configuration/View'
import GeneratorContent from '../../configuration/GeneratorContent'
import { groupBy } from '../../utils/arrayExtensions'
import DefaultFieldGenerator from '../default/DefaultFieldGenerator'
import { OpenAPIV3 } from 'openapi-types'
import { createFormTeplate } from './templates/CreateForm'
import { updateFormTeplate } from './templates/UpdateForm'
import { createPageTemplate } from './templates/CreatePage'
import { updatePageTemplate } from './templates/UpdatePage'

export default class RMFFormGenerator {
  constructor(private readonly _fieldGenerators: FieldGenerator[]) {}

  getImports(options: View): ComponentImport[] {
    const values = [
      new ComponentImport('formik', ['Formik', 'Form']),
      new ComponentImport('@mui/material', ['Button']),
      new ComponentImport('../api/Client', [options.entityTypeName])
    ]
    return values
  }

  getFieldGenerator(options: FieldOptions): FieldGenerator {
    return this._fieldGenerators.find((x) => x.isSupporting(options.schema)) || new DefaultFieldGenerator()
  }

  generate(view: View): GeneratorContent[] {
    const name = view.getOption('name')

    const combinedImports = [
      ...this.getImports(view),
      ...([] as ComponentImport[]).concat(
        ...view.fields.map((fieldOption) => this.getFieldGenerator(fieldOption).imports)
      )
    ]

    const groupedImports = groupBy(combinedImports, (x) => x.from)
    const mergedImports = Object.keys(groupedImports).map((x) =>
      groupedImports[x].reduce((merged, cur) => {
        return merged.merge(cur)
      })
    )

    const imports = mergedImports.map((x) => x.toString()).join('\n')

    const fieldIndents = 3

    const fields = ([] as GeneratorContent[]).concat(
      ...view.fields.map((x) => this.getFieldGenerator(x).generate(x, fieldIndents))
    )
    const formContent = `
${imports}

${
  view.endpoint.method === OpenAPIV3.HttpMethods.POST
    ? createFormTeplate(view, fields)
    : updateFormTeplate(view, fields)
}
    `

    const pageName = view.getOption('pageName')

    const pageContent =
      view.endpoint.method === OpenAPIV3.HttpMethods.POST ? createPageTemplate(view) : updatePageTemplate(view)

    return [
      new GeneratorContent('file', formContent, `src/components/${name}.tsx`),
      new GeneratorContent('file', pageContent, `src/pages/${pageName}.tsx`)
    ]
  }
}
