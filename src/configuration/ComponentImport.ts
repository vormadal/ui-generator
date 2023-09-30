export class ComponentImport {
  default?: string
  members: string[]
  from: string

  constructor(from: string, members?: string[], defaultImport?: string) {
    this.from = from
    this.default = defaultImport
    this.members = members || []
  }

  toString() {
    const modules: string[] = []
    if (this.default) {
      modules.push(this.default)
    }

    if (this.members.length) {
      modules.push(`{ ${this.members.join(', ')} }`)
    }

    return `import ${modules.join(', ')} from '${this.from}'`
  }

  merge(other: ComponentImport) {
    if (other.from !== this.from) {
      throw new Error('cannot merge imports from different packages')
    }

    if (other.default !== this.default) {
      throw new Error('cannot merge imports with different default exports')
    }

    return new ComponentImport(this.from, [...new Set([...this.members, ...other.members])], this.default)
  }
}
