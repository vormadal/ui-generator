import { OpenAPIV3 } from 'openapi-types'
import { View } from '../../../../configuration/View'
import { RMFContext } from '../../RMFContext'

export function listViewTemplate(view: View, ctx: RMFContext) {
  const { entityTypeName, entityPropertyName } = view ?? {}
  const name = view.getOption('name')
  const updateView = ctx.getViewByPath(view.endpoint.path, OpenAPIV3.HttpMethods.PUT, true)
  const showUpdateLink = !!updateView

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

  if(showUpdateLink){
    headers.push(`
              <TableCell
              component="th"
              scope="row"
              >
              edit
              </TableCell>
    `)

    values.push(`
    <TableCell>
      <Link to={\`${ctx.routeGenerator.getRouteTo(updateView, {id: '${row.id}'})}\`}>edit</Link>
    </TableCell>
    `)
  }

  return `
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ${entityTypeName} } from '../api/ApiClient' //TODO make dynamic
import { Link } from 'react-router-dom'

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
