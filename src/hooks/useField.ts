import { useState } from 'react'
import { Option } from '../configuration/Option'

type useFieldReturnType<T> = [data: T, setData: (value: T) => void]
export function useField<T extends Option>(option: T): useFieldReturnType<any> {
  const [value, setValue] = useState(option.value)

  function update(v: T) {
    option.value = v
    setValue(v)
  }
  return [value, update]
}
