import { Button, Grid, TextareaAutosize, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldOptions } from '../configuration/FieldOptions'
import { FormOptions } from '../configuration/FormOptions'
import { useGenerator } from '../contexts/GeneratorContext'
import { GeneratorOptionsContext } from '../contexts/GeneratorOptionsContext'

interface Props {
  active: number
  tab: number
  config: FormOptions
}

function FormConfigTab({ active, tab, config }: Props) {
  const [generator] = useGenerator()
  const [preview, setPreview] = useState('')

  function copyPreview() {
    navigator.clipboard.writeText(preview)
  }

  useEffect(() => {
    if (!config || !generator) return
    setPreview(
      generator
        .generate([config])
        .map(
          (x) => `// ${x.name}
    ${x.content}

    `
        )
        .join('')
    )
  }, [generator, config])

  const updateForm = useCallback((options: FormOptions) => {
    // setOptions((previous) => ({
    //   ...previous,
    //   formOptions: options
    // }))
  }, [])

  const updateField = useCallback((options: FieldOptions) => {
    // setOptions((previous) => {
    //   const fieldOptions = [...previous.fieldOptions]
    //   const index = fieldOptions.findIndex((x) => x.id === options.id)
    //   fieldOptions.splice(index, 1, options)
    //   return {
    //     ...previous,
    //     fieldOptions: fieldOptions
    //   }
    // })
  }, [])

  const updater = useMemo(
    () => ({
      updateForm,
      updateField
    }),
    [updateForm, updateField]
  )
  if (active !== tab || !config || !generator?.renderer) return null

  return (
    <GeneratorOptionsContext.Provider value={[config, updater]}>
      <Grid container>
        <Grid
          item
          xs={12}
        >
          <generator.renderer.FormRenderer
            options={config}
            onChange={updater.updateForm}
          />

          <Typography variant="h5">Property options</Typography>
          {config.fieldOptions.map((options, i) => (
            <generator.renderer.FieldRenderer
              key={options.id || i}
              options={options}
              onChange={updater.updateField}
            />
          ))}

          <TextareaAutosize
            minRows={20}
            maxRows={30}
            value={preview}
            style={{ width: '100%', marginRight: '-2rem' }}
          />
          <Button
            variant={'contained'}
            onClick={copyPreview}
          >
            Copy to clipboard
          </Button>
        </Grid>
      </Grid>
    </GeneratorOptionsContext.Provider>
  )
}

export default FormConfigTab
