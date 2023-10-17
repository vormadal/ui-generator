import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { Checkbox, Collapse, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { FieldOptions } from '../../configuration/FieldOptions'
import { useField } from '../../hooks/useField'
import { ExpandMore } from '../ExpandMore'

interface Props {
  id: string
  onChange: (options: FieldOptions) => void
}

function DefaultTextFieldConfiguration({ id }: Props) {
  const [value, update] = useField<FieldOptions>(id)
  const { name, label, isRequired } = value || {}
  const [expand, setExpand] = useState(false)

  function updateLabel(v: string) {
    value.label = v
    update(value)
  }

  function updateIsRequired(v: boolean) {
    value.isRequired = v
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
