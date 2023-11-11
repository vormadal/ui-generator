import { View } from '../../../../configuration/View'
import { RMFContext } from '../../RMFContext'

export function ListDetailsPageTemplate(view: View, ctx: RMFContext) {
  const { entityTypeName } = view ?? {}
  const name = view.getOption('name')
  const pageName = view.getOption('pageName')

  return `
import { Grid, Typography } from '@mui/material'
import { ${name} } from '../components/${name}' //TODO get this import dynamically
import { Api } from '../api' //TODO get this import dynamically
import { ${entityTypeName} } from '../api/ApiClient' //TODO get this import dynamically
import { Loading, useData } from '@vormadal/react-mui'

function ${pageName}() {
    const [data] = useData(() => Api.${view.endpoint.operationName}())
    return (
    <Grid
        container
        justifyContent="center"
    >
        <Grid
        item
        xs={11}
        md={10}
        >
        <Typography variant="h5">${name}</Typography>
        <Loading {...data}>
            {(result) => <${name} data={result} />}
        </Loading>
        </Grid>
    </Grid>
    )
}

export default ${pageName}
    `
}
