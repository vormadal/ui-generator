import { createContext, useContext } from 'react'
import { GeneratorOptions } from '../configuration/GeneratorOptions'
import { FormOptions } from '../configuration/FormOptions'
import { FieldOptions } from '../configuration/FieldOptions'

interface GeneratorUpdater {
  updateForm(options: FormOptions): void | Promise<void>
  updateField(options: FieldOptions): void | Promise<void>
}

export const GeneratorOptionsContext = createContext<[GeneratorOptions | undefined, GeneratorUpdater]>([
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
