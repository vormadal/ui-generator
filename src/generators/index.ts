import { CodeGenerator } from '../configuration/CodeGenerator'

class GeneratorConfigurations {
  private readonly _options: CodeGenerator[] = []
  configure(generator: CodeGenerator) {
    if (this._options.find((x) => x.name === generator.name)) {
      throw new Error(`Generator with name ${generator.name} already exists`)
    }
    this._options.push(generator)
  }

  get options() {
    return this._options
  }
}

export default new GeneratorConfigurations()
