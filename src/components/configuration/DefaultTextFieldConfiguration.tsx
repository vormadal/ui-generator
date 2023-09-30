import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { Checkbox, Collapse, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { TextFieldOptions } from '../../configuration/TextFieldOptions'
import { useGeneratorOptions } from '../../contexts/GeneratorOptionsContext'
import { ExpandMore } from '../ExpandMore'
import { useField } from '../../hooks/useField'

interface Props {
  id: string
  onChange: (options: TextFieldOptions) => void
}

function DefaultTextFieldConfiguration({ id }: Props) {
  const [value, update] = useField<TextFieldOptions>(id)
  const { name, label, validation } = value || {}
  const { isRequired } = validation || {}
  const [expand, setExpand] = useState(false)

  function updateLabel(v: string) {
    value.label = v
    update(value)
  }

  function updateIsRequired(v: boolean) {
    value.validation.isRequired = v
    update(value)
  }

  return (
    <Grid container>
      <Grid
        item
        xs={12}
      >
        <Typography variant="h5">
          {name}
          <ExpandMore
            expand={!expand}
            onClick={() => setExpand(!expand)}
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Typography>

        <Collapse in={expand}>
          <TextField
            name="name"
            label="Property Name"
            value={name || ''}
            fullWidth
            disabled
          />
          <TextField
            name="label"
            label="Label"
            value={label || ''}
            fullWidth
            onChange={(e) => updateLabel(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isRequired || false}
                disabled
                onChange={(e) => updateIsRequired(e.target.checked)}
              />
            }
            label="Is Required"
          />
        </Collapse>
      </Grid>
    </Grid>
  )
}

export default DefaultTextFieldConfiguration
