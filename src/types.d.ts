import ProjectConfiguration from './system/ProjectConfiguration'
import SystemConfiguration from './system/SystemConfiguration'

export {}
declare global {
  interface Window {
    electronAPI: {
      getSystemConfiguration(): Promise<SystemConfiguration>
      getProject(id: string): Promise<ProjectConfiguration>

      selectFile(): Promise<string>
      selectDirectory(): Promise<string>

      saveSystemConfiguration(config: SystemConfiguration): Promise<void>
      saveProject(config: ProjectConfiguration): Promise<void>

      readFile(path: string): Promise<string>
      writeFile(path: string, content: string): Promise<void>

      runScript(directory: string, command: string): Promise<void>
    }
  }
}
