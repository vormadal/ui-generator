import GeneratorContent, { GeneratorContentType } from '../../configuration/GeneratorContent'
import ProjectConfiguration from '../../system/ProjectConfiguration'

export default class ApiGenerator implements GeneratorContent {
  constructor(public readonly project: ProjectConfiguration) {}

  get type(): GeneratorContentType {
    return 'file'
  }

  get directory() {
    return 'src/api'
  }

  get ApiClientclassName() {
    return 'ApiClient'
  }

  get name() {
    return 'index'
  }

  get filename() {
    return `${this.directory}/${this.name}.ts`
  }

  get scriptName() {
    return 'api'
  }

  generate = async (): Promise<string> => {
    await window.electronAPI.runScript(this.project.projectDirectory, `npm install -D nswag`)

    await window.electronAPI.runScript(this.project.projectDirectory, `npm run ${this.scriptName}`)

    return `
import { ${this.ApiClientclassName} } from "./${this.ApiClientclassName}";

export const Api = new ${this.ApiClientclassName}()
`
  }
}
