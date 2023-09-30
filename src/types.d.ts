import { GeneratorOptions } from './configuration/GeneratorOptions'

export {}
declare global {
  interface Window {
    electronAPI: {
      selectProject(): Promise<string>
      getFormData(id: string): Promise<any>
      saveFormData(options: GeneratorOptions): Promise<void>
    }
  }
}
