import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { useEffect, useState } from 'react'
import { CodeGenerator } from '../configuration/CodeGenerator'
import { useGenerator } from '../contexts/GeneratorContext'
import generators from '../generators'

function Project() {
  const [filename, setFilename] = useState()
  const [generator, setGenerator] = useGenerator()
  const [options, setOptions] = useState<CodeGenerator[]>([])
  async function handleChange() {
    const filePath = await window.electronAPI.selectProject()
    console.log('filepath', filePath)
  }

  useEffect(() => {
    async function loadOptions() {
      setOptions(generators.options)
      if (!generator) {
        setGenerator(generators.options[0])
      }
    }

    loadOptions()
  }, [])
  return (
    <Grid container>
      <Grid
        item
        xs={12}
      >
        <Button onClick={handleChange}>Select Project Directory</Button>
        <FormControl fullWidth>
          <InputLabel id="select-generator-label">Generator</InputLabel>
          <Select
            labelId="select-generator-label"
            id="select-generator"
            value={generator?.name ?? ''}
            onChange={(e) => setGenerator(generators.options.find((x) => x.name === e.target.value))}
          >
            {options.map((x) => (
              <MenuItem
                key={x.name}
                value={x.name}
              >
                {x.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default Project
