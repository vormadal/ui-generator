import { View } from '../../../../configuration/View'
import { RMFContext } from '../../RMFContext'

export function listViewTemplate(view: View, ctx: RMFContext) {
  const { entityTypeName, entityPropertyName } = view ?? {}
  const name = view.getOption('name')
  const headers = view.fields.map(
    (x) => `
            <TableCell
            component="th"
            scope="row"
            >
            ${x.name}
            </TableCell>
  `
  )

  const values = view.fields.map(
    (x) => `
            <TableCell>{row.${x.name}?.toString() || ''}</TableCell>
  `
  )
  return `
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ${entityTypeName} } from '../api/ApiClient' //TODO make dynamic

interface Props {
    data: ${entityTypeName}[]
}

export function ${name}({ data }: Props) {

return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650 }}
        aria-label="${entityPropertyName} table"
      >
        <TableHead>
            <TableRow>
                ${headers.join('\n')}
            </TableRow>
        </TableHead>
        <TableBody>
            {data.map(row => (
                <TableRow key={row.id}>
                    ${values.join('\n')}
                </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
)
}

export default ${name}  
    `
}
