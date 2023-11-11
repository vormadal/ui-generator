import GeneratorContent, { GeneratorContentType } from '../../configuration/GeneratorContent'
import { AppTemplate } from './templates/app/App'

export default class AppGenerator implements GeneratorContent {
  type: GeneratorContentType = 'file'
  get directory() {
    return 'src'
  }

  get name() {
    return 'App'
  }

  get filename() {
    return `${this.directory}/${this.name}.tsx`
  }

  generate = async (): Promise<string> => {
    return AppTemplate(this.name)
  }
}
