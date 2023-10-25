import React from 'react'
import { View } from './FormOptions'
import { FieldOptions } from './FieldOptions'

export interface RendererProps<T> {
  options: T
  onChange: (options: T) => void | Promise<void>
}

export interface OptionRenderer {
  get FormRenderer(): React.JSXElementConstructor<RendererProps<View>>
  get FieldRenderer(): React.JSXElementConstructor<RendererProps<FieldOptions>>
}
