import { createTheme } from '@mui/material'

export const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: '1rem'
        }
      }
    }
  }
})
