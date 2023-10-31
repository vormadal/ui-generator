import { ComponentImport } from '../../configuration/ComponentImport'
import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import { View } from '../../configuration/View'
import GeneratorContent from '../../configuration/GeneratorContent'
import { groupBy } from '../../utils/arrayExtensions'
import DefaultFieldGenerator from '../default/DefaultFieldGenerator'

export default class RMFFormGenerator {
  constructor(private readonly _fieldGenerators: FieldGenerator[]) {}

  getImports(options: View): ComponentImport[] {
    const values = [
      new ComponentImport('formik', ['Formik', 'Form']),
      new ComponentImport('@mui/material', ['Button']),
      new ComponentImport(options.entityImportPath, [options.entityTypeName])
    ]
    return values
  }

  getFieldGenerator(options: FieldOptions): FieldGenerator {
    return this._fieldGenerators.find((x) => x.isSupporting(options.endpoint.source)) || new DefaultFieldGenerator()
  }

  generate(view: View): GeneratorContent[] {
    const { entityTypeName, entityPropertyName, hasInitialValues } = view ?? {}
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
    const content = `
${imports}

interface Props {
  onSubmit: (${entityPropertyName}: ${entityTypeName}) => void | Promise<void>
  ${hasInitialValues ? `${entityPropertyName}: ${entityTypeName}` : ''}
}

export function ${name}({ onSubmit${hasInitialValues ? `, ${entityPropertyName}` : ''} }: Props) {
  
  return (
    <Formik
      initialValues={${hasInitialValues ? entityPropertyName : `new ${entityTypeName}()`}}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
${fields.map((x) => x.content).join('\n')}
          <Button type="submit">${hasInitialValues ? 'Save' : 'Create'}</Button>
        </Form>
      )}
    </Formik>
  )
}

export default ${name}
    `

    const pageName = name.replace('Form', 'Page')
    
    const pageContent = `
import { Button, Grid, Typography } from '@mui/material'
import { Loading, useData, useRequest, useToast } from '@vormadal/react-mui'
import { ${name} } from '../components/${name}'
import { Api } from '../api'
${view.isUpdateForm ? `import { useParams } from 'react-router-dom'` : ''}


function ${pageName}() {
  ${view.isUpdateForm ? 'const params = useParams<{ id: string }>()' : ''}
  ${view.isUpdateForm ? `const ${entityPropertyName} = useData(async (id: string | undefined) => (!id ? undefined : Api.${view.getOperationName}(id)))` : ''}
  return (
    <Grid
      container
      justifyContent="center"
    >
      <Grid
        item
        xs={11}
        md={6}
      >
        <Typography variant="h5">${name}</Typography>
        
      </Grid>
    </Grid>
  )
}

export default ${pageName}
    `
    return [
      new GeneratorContent('file', content, `src/components/${name}.tsx`),
      new GeneratorContent('file', pageContent, `src/pages/${pageName}.tsx`)]
  }
}
