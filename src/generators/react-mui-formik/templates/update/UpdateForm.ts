import { ComponentImport } from '../../../../configuration/ComponentImport'
import { View } from '../../../../configuration/View'
import { RMFContext } from '../../RMFContext'
import { mergeImports } from '../../utils/importUtils'

export function updateFormTeplate(view: View, ctx: RMFContext) {
  const { entityTypeName, entityPropertyName } = view ?? {}

  const imports = mergeImports([
    new ComponentImport('formik', ['Formik', 'Form']),
    new ComponentImport('@mui/material', ['Button']),
    new ComponentImport('../api/ApiClient', [entityTypeName]),
    ...([] as ComponentImport[]).concat(...view.fields.map((fieldOption) => ctx.getFieldGenerator(fieldOption).imports))
  ])
  const name = view.getOption('name')

  return `
${imports.map((x) => x.toString()).join('\n')}

interface Props {
    onSubmit: (${entityPropertyName}: ${entityTypeName}) => void | Promise<void>
    ${entityPropertyName}: ${entityTypeName}
}

export function ${name}({ onSubmit, ${entityPropertyName}}: Props) {

return (
    <Formik
    initialValues={${entityPropertyName}}
    onSubmit={onSubmit}
    >
    {({ values, handleChange, setFieldValue }) => (
        <Form>
${view.fields.map((x) => ctx.getFieldGenerator(x).generate(x, 3)).join('\n')}
        <Button type="submit">Save</Button>
        </Form>
    )}
    </Formik>
)
}

export default ${name}
    `
}
