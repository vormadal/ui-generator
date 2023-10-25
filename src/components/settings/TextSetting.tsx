import { TextField } from '@mui/material'
import { Option } from '../../configuration/Option'
import { useField } from '../../hooks/useField'

interface Props {
  option: Option
}

function TextSetting({ option }: Props) {
  const [value, onChange] = useField(option)
  return (
    <TextField
      name={option.name}
      label={option.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
    />
  )
}

export default TextSetting
