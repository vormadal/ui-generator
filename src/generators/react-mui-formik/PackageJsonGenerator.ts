import GeneratorContent, { GeneratorContentType } from '../../configuration/GeneratorContent'
import ProjectConfiguration from '../../system/ProjectConfiguration'
import ApiGenerator from './ApiGenerator'

export default class PackageJsonGenerator implements GeneratorContent {
  constructor(public readonly project: ProjectConfiguration, public readonly apiClient: ApiGenerator) {}

  get type(): GeneratorContentType {
    return 'file'
  }

  get directory() {
    return ''
  }

  get name() {
    return 'package'
  }

  get filename() {
    return `${this.name}.json`
  }

  generate = async (): Promise<string> => {
    const { projectDirectory, openapiSpecPath } = this.project
    const { ApiClientclassName, directory: location } = this.apiClient
    const packageJson = JSON.parse(await window.electronAPI.readFile(`${projectDirectory}/${this.filename}`))
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }
    packageJson.scripts[
      this.apiClient.scriptName
    ] = `nswag openapi2tsclient /Input:${openapiSpecPath} /output:${location}/${ApiClientclassName}.ts /className:${ApiClientclassName} /template:axios`

    return JSON.stringify(packageJson, undefined, 2)
  }
}
