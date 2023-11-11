export function AppTemplate(name: string) {
  return `
    import { Grid } from '@mui/material'
    import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
    import { LocalizationProvider } from '@mui/x-date-pickers'
    import Navigation from './Navigation' //TODO do dynamic
    import AppRoutes from './AppRoutes' //TODO do dynamic
    import { HashRouter as Router } from 'react-router-dom'
    import { ToastProvider } from '@vormadal/react-mui'
    
    function ${name}() {
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Router>
              <ToastProvider>
                <>
                  <Navigation>
                    <Grid container>
                      <Grid
                        item
                        xs={10}
                      >
                        <AppRoutes />
                      </Grid>
                    </Grid>
                  </Navigation>
                </>
              </ToastProvider>
            </Router>
          </LocalizationProvider>      
        )
    }
    
    export default ${name}
        `
}
