import GeneratorContent from '../../configuration/GeneratorContent'
import ProjectConfiguration from '../../system/ProjectConfiguration'

export default class ApiGenerator {
  get location() {
    return 'src/api'
  }

  get ApiClientclassName() {
    return 'ApiClient'
  }

  relativePath = (to: string) => {
    return to //TODO
    // return path.relative(to, this.location)
  }

  generate = async (project: ProjectConfiguration): Promise<GeneratorContent[]> => {
    const packageJson = JSON.parse(await window.electronAPI.readFile(`${project.projectDirectory}/package.json`))
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }
    const script = 'api'
    packageJson.scripts[
      script
    ] = `nswag openapi2tsclient /Input:${project.openapiSpecPath} /output:src/api/${this.ApiClientclassName}.ts /className:${this.ApiClientclassName} /template:axios`

    return [
      new GeneratorContent('file', JSON.stringify(packageJson, undefined, 2), 'package.json'),
      new GeneratorContent('script', `npm install -D nswag`),
      new GeneratorContent('script', `npm run ${script}`)
    ]
  }
}
