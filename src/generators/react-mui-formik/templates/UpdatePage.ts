import { View } from '../../../configuration/View'

export function updatePageTemplate(view: View) {
  const { entityPropertyName, entityTypeName } = view ?? {}
  const name = view.getOption('name')
  const pageName = view.getOption('pageName')
  const getEndpointName = view.getOption('getEndpointName')
  
  return `
import { Button, Grid, Typography } from '@mui/material'
import { Loading, useData, useRequest, useToast } from '@vormadal/react-mui'
import { ${name} } from '../components/${name}'
import { ${entityTypeName} } from '../api/Client'
import { Api } from '../api'
import { useParams } from 'react-router-dom'


function ${pageName}() {
    ${view.isUpdateForm ? 'const params = useParams<{ id: string }>()' : ''}
    ${
      view.isUpdateForm
        ? `const ${entityPropertyName} = useData(async (id: string | undefined) => (!id ? undefined : Api.${getEndpointName}(id)))`
        : ''
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
