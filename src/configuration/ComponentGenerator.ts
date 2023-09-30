import { ComponentImport } from './ComponentImport'

export interface ComponentGenerator {
  generate(children?: ComponentGenerator[]): string
  get imports(): ComponentImport[]
}
