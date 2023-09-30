import { FieldGenerator } from "./FieldGenerator"
import { FormOptions } from "./FormOptions"

export interface FormGenerator {
  get options(): FormOptions
  generate(properties: FieldGenerator[]): string
  Component: React.JSXElementConstructor<object>
}
