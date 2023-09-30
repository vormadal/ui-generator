import { Alert } from '@mui/material'
import { FieldOptions } from '../../configuration/FieldOptions'

interface Props {
  options: FieldOptions
}

function UnknownFieldConfiguration({ options }: Props) {
  return <Alert severity="error">type '{options.type}' is currently not supported</Alert>
}

export default UnknownFieldConfiguration
