import { View } from '../../../../configuration/View'
import { RMFContext } from '../../RMFContext'

export function createPageTemplate(view: View, ctx: RMFContext) {
  const { entityTypeName, entityPropertyName } = view ?? {}
  const name = view.getOption('name')
  const pageName = view.getOption('pageName')
  const createEndpointName = view.getOption('createEndpointName')

  return `
import { Grid, Typography } from '@mui/material'
import { ${name} } from '../components/${name}' //TODO get this import dynamically
import { Api } from '../api' //TODO get this import dynamically
import { ${entityTypeName} } from '../api/ApiClient' //TODO get this import dynamically

function ${pageName}() {
    function handleSubmit(${entityPropertyName}: ${entityTypeName}){
        Api.${createEndpointName}(${entityPropertyName})
    }
    return (
    <Grid
        container
        justifyContent="center"
    >
        <Grid
        item
        xs={11}
        md={6}
        >
        <Typography variant="h5">${name}</Typography>
        <${name} onSubmit={handleSubmit} />
        </Grid>
    </Grid>
    )
}

export default ${pageName}
    `
}
