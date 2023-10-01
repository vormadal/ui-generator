import { Button, Grid, TextareaAutosize, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldOptions } from '../configuration/FieldOptions'
import { FormOptions } from '../configuration/FormOptions'
import { GeneratorOptions } from '../configuration/GeneratorOptions'
import { TextFieldOptions } from '../configuration/TextFieldOptions'
import { useGenerator } from '../contexts/GeneratorContext'
import { GeneratorOptionsContext } from '../contexts/GeneratorOptionsContext'
import { ExtendedOperationObject } from '../openApi/ExtendedOperationObject'

interface Props {
  active: number
  tab: number
  config: ExtendedOperationObject
}

function FormConfigTab({ active, tab, config }: Props) {
  const [generator] = useGenerator()
  const [options, setOptions] = useState<GeneratorOptions>()
  const [preview, setPreview] = useState('')

  function copyPreview() {
    navigator.clipboard.writeText(preview)
  }
  useEffect(() => {
    if (!generator || options) {
      return
    }

    async function loadOptions() {
      const formOptions = new FormOptions(config)
      const existing = await window.electronAPI.getFormData(formOptions.id)

      if (existing) {
        setOptions(existing)
      } else {
        setOptions({
          fieldOptions: config.properties.map((x) => new TextFieldOptions(x)),
          formOptions: new FormOptions(config)
        })
      }
    }

    loadOptions()
    return () => {
      window.electronAPI.saveFormData(options)
    }
  }, [generator, options])

  useEffect(() => {
    if (!options) return
    setPreview(
      generator
        .generate(options)
        .map(
          (x) => `// ${x.name}
    ${x.content}

    `
        )
        .join('')
    )
  }, [generator, options])

  const updateForm = useCallback((options: FormOptions) => {
    setOptions((previous) => ({
      ...previous,
      formOptions: options
    }))
  }, [])

  const updateField = useCallback((options: FieldOptions) => {
    setOptions((previous) => {
      const fieldOptions = [...previous.fieldOptions]
      const index = fieldOptions.findIndex((x) => x.id === options.id)
      fieldOptions.splice(index, 1, options)
      return {
        ...previous,
        fieldOptions: fieldOptions
      }
    })
  }, [])
  const updater = useMemo(
    () => ({
      updateForm,
      updateField
    }),
    [updateForm, updateField]
  )
  if (active !== tab || !options) return null

  return (
    <GeneratorOptionsContext.Provider value={[options, updater]}>
      <Grid container>
        <Grid
          item
          xs={12}
        >
          <generator.renderer.FormRenderer
            options={options.formOptions}
            onChange={updater.updateForm}
          />

          <Typography variant="h5">Property options</Typography>
          {options.fieldOptions.map((options, i) => (
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
