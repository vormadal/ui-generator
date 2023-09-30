import { Collapse, Grid, TextField, Typography } from '@mui/material'
import { FormOptions } from '../../configuration/FormOptions'
import { ExpandMore } from '../ExpandMore'
import { useState } from 'react'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

interface Props {
  options: FormOptions
  onChange: (options: FormOptions) => void | Promise<void>
}

function DefaultFormConfiguration({ options }: Props) {
  const { name } = options
  const [expand, setExpand] = useState(true)
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs={12}
      >
        <Typography variant="h5">
          Form Options
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
            label="Form Name"
            value={name}
            fullWidth
            disabled
          />
        </Collapse>
      </Grid>
    </Grid>
  )
}

export default DefaultFormConfiguration
