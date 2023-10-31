import GeneratorContent from '../../../configuration/GeneratorContent'
import { View } from '../../../configuration/View'

export function createFormTeplate(view: View, fields: GeneratorContent[]) {
  const { entityTypeName, entityPropertyName } = view ?? {}
  const name = view.getOption('name')

  return `
interface Props {
    onSubmit: (${entityPropertyName}: ${entityTypeName}) => void | Promise<void>
}
    
export function ${name}({ onSubmit }: Props) {

return (
    <Formik
    initialValues={new ${entityTypeName}()}
    onSubmit={onSubmit}
    >
    {({ values, handleChange, setFieldValue }) => (
        <Form>
${fields.map((x) => x.content).join('\n')}
        <Button type="submit">Create</Button>
        </Form>
    )}
    </Formik>
)
}

export default ${name}
    `
}
