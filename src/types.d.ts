import { GeneratorOptions } from './configuration/GeneratorOptions'
import ProjectConfiguration from './system/ProjectConfiguration'
import SystemConfiguration from './system/SystemConfiguration'

export {}
declare global {
  interface Window {
    electronAPI: {
      getSystemConfiguration(): Promise<SystemConfiguration>
      getProject(id: string): Promise<ProjectConfiguration>

      saveSystemConfiguration(config: SystemConfiguration): Promise<void>
      saveProject(config: ProjectConfiguration): Promise<void>

      selectProject(): Promise<string>
      getFormData(id: string): Promise<any>
      saveFormData(options: GeneratorOptions): Promise<void>
    }
  }
}
