import GeneratorContent from '../../configuration/GeneratorContent'
import ProjectConfiguration from '../../system/ProjectConfiguration'

export default class ApiGenerator {
  get location() {
    return 'src/api'
  }

  get ApiClientclassName(){
    return 'ApiClient'
  }

  relativePath = (to: string) => {
    return to //TODO
    // return path.relative(to, this.location)
  }

  generate = (project: ProjectConfiguration): GeneratorContent[] => {
    return [
        new GeneratorContent('script', `npm install -D nswag`),
        new GeneratorContent('script', `npm run nswag openapi2tsclient /Input:${project.openapiSpecPath} /output:src/api/${this.ApiClientclassName}.ts /className:${this.ApiClientclassName} /template:axios`)
    ]
    
  }
}
