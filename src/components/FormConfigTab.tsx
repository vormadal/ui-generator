import { Button, Grid, TextareaAutosize, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldOptions } from '../configuration/FieldOptions'
import { View } from '../configuration/View'
import { useGenerator } from '../contexts/GeneratorContext'
import { ViewContext } from '../contexts/ViewContext'
import TextSetting from './settings/TextSetting'

interface Props {
  active: number
  tab: number
  view: View
}

function FormConfigTab({ active, tab, view }: Props) {
  const [generator] = useGenerator()
  const [preview, setPreview] = useState('')

  function copyPreview() {
    navigator.clipboard.writeText(preview)
  }

  useEffect(() => {
    if (!view || !generator) return
    setPreview(
      generator
        .generate([view], true)
        .map(
          (x) => `// ${x.name}
    ${x.content}

    `
        )
        .join('')
    )
  }, [generator, view])

  const updateForm = useCallback((options: View) => {
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
  if (active !== tab || !view) return null

  return (
    <ViewContext.Provider value={[view, updater]}>
      <Grid container>
        <Grid
          item
          xs={12}
        >
          {view.options?.map((x) => (
            <TextSetting
              key={x.name}
              option={x}
            />
          ))}
          <Typography variant="h5">Fields</Typography>
          <Typography variant="body1">TODO</Typography>

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
    </ViewContext.Provider>
  )
}

export default FormConfigTab
