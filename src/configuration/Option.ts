export enum OptionType {
  string,
  number
}
export interface Option {
  type: OptionType
  name: string
  label: string
  value: any
}

export class TextOption implements Option {
  public readonly type = OptionType.string
  constructor(public readonly label: string, public readonly name: string, public value: string) {}
}

export class NumberOption implements Option {
  public readonly type = OptionType.number
  constructor(public readonly label: string, public readonly name: string, public value: number) {}
}
