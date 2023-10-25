import { createContext, useContext } from 'react'
import { FieldOptions } from '../configuration/FieldOptions'
import { View } from '../configuration/FormOptions'

interface ViewUpdater {
  updateForm(options: View): void | Promise<void>
  updateField(options: FieldOptions): void | Promise<void>
}

export const ViewContext = createContext<[View | undefined, ViewUpdater]>([
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

export function useView() {
  return useContext(ViewContext)
}
