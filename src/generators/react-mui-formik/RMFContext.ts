import { FieldGenerator } from '../../configuration/FieldGenerator'
import { FieldOptions } from '../../configuration/FieldOptions'
import DefaultFieldGenerator from '../default/DefaultFieldGenerator'
import ApiGenerator from './ApiGenerator'

export class RMFContext {
  constructor(public readonly _fieldGenerators: FieldGenerator[]) {}

  public apiGenerator: ApiGenerator

  getFieldGenerator(options: FieldOptions): FieldGenerator {
    return this._fieldGenerators.find((x) => x.isSupporting(options.schema)) || new DefaultFieldGenerator()
  }
}
