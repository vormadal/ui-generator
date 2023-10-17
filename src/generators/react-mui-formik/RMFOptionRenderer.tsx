import DefaultFormConfiguration from '../../components/configuration/DefaultFormConfiguration'
import DefaultTextFieldConfiguration from '../../components/configuration/DefaultTextFieldConfiguration'
import UnknownFieldConfiguration from '../../components/configuration/UnknownFieldConfiguration'
import { FieldOptions } from '../../configuration/FieldOptions'
import { OptionRenderer, RendererProps } from '../../configuration/OptionRenderer'

export class RMFOptionRenderer implements OptionRenderer {
  get FormRenderer() {
    return DefaultFormConfiguration
  }

  private readonly _fieldRenderer = ({ options, onChange }: RendererProps<FieldOptions>) => {
    switch (options.type) {
      case 'string':
      case 'boolean':
        return (
          <DefaultTextFieldConfiguration
            key={options.id}
            id={options.id}
            onChange={onChange}
          />
        )

      default:
        return <UnknownFieldConfiguration options={options} />
    }
  }
  get FieldRenderer() {
    return this._fieldRenderer
  }
}
