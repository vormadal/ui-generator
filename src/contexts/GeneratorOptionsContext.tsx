import { createContext, useContext } from 'react'
import { FieldOptions } from '../configuration/FieldOptions'
import { FormOptions } from '../configuration/FormOptions'

interface GeneratorUpdater {
  updateForm(options: FormOptions): void | Promise<void>
  updateField(options: FieldOptions): void | Promise<void>
}

export const GeneratorOptionsContext = createContext<[FormOptions | undefined, GeneratorUpdater]>([
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
