import { useEffect, useState } from 'react'
import { FieldOptions } from '../configuration/FieldOptions'
import { useGeneratorOptions } from '../contexts/GeneratorOptionsContext'

type useFieldReturnType<T> = [data: T, setData: (value: T) => void]
export function useField<T extends FieldOptions>(id: string, defaultValue?: T): useFieldReturnType<T> {
  const [options, updater] = useGeneratorOptions()
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (!options) return
    const option = options.fields.find((x) => x.id === id) as T
    setValue(option)
  }, [options])

  function update(v: T) {
    updater.updateField(v)
    setValue(v)
  }
  return [value, update]
}
