export type GeneratorContentType = 'file' | 'partial'
export default class GeneratorContent {
  constructor(
    public readonly type: GeneratorContentType,
    public readonly content: string,
    public readonly name?: string
  ) {}
}
