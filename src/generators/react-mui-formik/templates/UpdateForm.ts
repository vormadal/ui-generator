import GeneratorContent from '../../../configuration/GeneratorContent'
import { View } from '../../../configuration/View'

export function updateFormTeplate(view: View, fields: GeneratorContent[]) {
  const { entityTypeName, entityPropertyName } = view ?? {}
  const name = view.getOption('name')

  return `
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
${fields.map((x) => x.content).join('\n')}
        <Button type="submit">Save</Button>
        </Form>
    )}
    </Formik>
)
}

export default ${name}
    `
}
