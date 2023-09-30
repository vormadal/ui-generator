import React from 'react'
import { FormOptions } from './FormOptions'
import { FieldOptions } from './FieldOptions'

export interface RendererProps<T> {
  options: T
  onChange: (options: T) => void | Promise<void>
}

export interface OptionRenderer {
  get FormRenderer(): React.JSXElementConstructor<RendererProps<FormOptions>>
  get FieldRenderer(): React.JSXElementConstructor<RendererProps<FieldOptions>>
}
