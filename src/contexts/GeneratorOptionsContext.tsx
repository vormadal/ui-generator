import { createContext, useContext } from 'react'
import { FieldOptions } from '../configuration/FieldOptions'
import { View } from '../configuration/FormOptions'

interface GeneratorUpdater {
  updateForm(options: View): void | Promise<void>
  updateField(options: FieldOptions): void | Promise<void>
}

export const GeneratorOptionsContext = createContext<[View | undefined, GeneratorUpdater]>([
  undefined,
  {
    updateField: () => {
      throw new Error('not implemented')
    },
    updateForm: () => {
      throw new Error('not implemented')
    }
  }
])

export function useGeneratorOptions() {
  return useContext(GeneratorOptionsContext)
}
