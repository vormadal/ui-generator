import { View } from '../../../../configuration/View'
import { RMFContext } from '../../RMFContext'
import { ListDetailsPageTemplate } from './ListPage'

export function detailsPageTemplate(view: View, ctx: RMFContext) {
  const { entityTypeName, entityPropertyName } = view ?? {}
  const name = view.getOption('name')
  const pageName = view.getOption('pageName')
  const createEndpointName = view.getOption('createEndpointName')

  if (view.isListView) return ListDetailsPageTemplate(view, ctx)

  return `
import { Grid, Typography } from '@mui/material'
import { ${name} } from '../components/${name}' //TODO get this import dynamically
import { Api } from '../api' //TODO get this import dynamically
import { ${entityTypeName} } from '../api/ApiClient' //TODO get this import dynamically

function ${pageName}() {
    function handleSubmit(${entityPropertyName}: ${entityTypeName}){
        // Api.${createEndpointName}(${entityPropertyName})
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
        
        </Grid>
    </Grid>
    )
}

export default ${pageName}
    `
}
