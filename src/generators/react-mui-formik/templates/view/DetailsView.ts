import { View } from '../../../../configuration/View'
import { RMFContext } from '../../RMFContext'
import { listViewTemplate } from './ListView'

export function detailsViewTemplate(view: View, ctx: RMFContext) {
  const { entityTypeName, entityPropertyName, isListView } = view ?? {}
  const name = view.getOption('name')

  if (isListView) {
    return listViewTemplate(view, ctx)
  }

  const fields = view.fields.map(
    (x) => `
            <TableRow>
                <TableCell
                component="th"
                scope="row"
                >
                ${x.name}
                </TableCell>
                <TableCell align="right">{data.${x.name}?.toString() || ''}</TableCell>
            </TableRow>
  `
  )
  return `
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { ${entityTypeName} } from '../api/ApiClient' //TODO make dynamic

interface Props {
    data: ${entityTypeName}
}

export function ${name}({ data }: Props) {

return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650 }}
        aria-label="${entityPropertyName} table"
      >
        <TableBody>
          ${fields.join('\n')}
        </TableBody>
      </Table>
    </TableContainer>
)
}

export default ${name}  
    `
}
