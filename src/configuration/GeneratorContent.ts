export type GeneratorContentType = 'file' | 'partial' | 'script'
export default interface GeneratorContent {
  readonly type: GeneratorContentType
  readonly filename: string
  readonly directory: string
  readonly name: string

  generate(): Promise<string>
}
