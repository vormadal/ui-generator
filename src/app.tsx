import { Grid, Tab, Tabs, ThemeProvider } from '@mui/material'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter as Router } from 'react-router-dom'
import FormConfigTab from './components/FormConfigTab'

import { GeneratorProvider } from './contexts/GeneratorContext'
import { ProjectProvider, useProject } from './contexts/ProjectContext'
import generators from './generators'
import ReactMuiFormikGenerator from './generators/react-mui-formik'
import { theme } from './utils/theme'
import Project from './components/Project'

generators.configure(new ReactMuiFormikGenerator())

function App() {
  const [project] = useProject()
  const [viewTab, setViewTab] = useState(0)

  return (
    <Grid container>
      <Grid
        item
        xs={12}
      >
        <Project />
      </Grid>
      <Grid
        item
        xs={6}
      >
        <Tabs
          orientation="vertical"
          value={viewTab}
          onChange={(e, v) => setViewTab(v)}
        >
          {project?.schema?.paths?.map((x) => (
            <Tab
              key={x.id}
              // onClick={() => setActiveGroup(x)}
              label={x.id}
            />
          ))}
        </Tabs>
      </Grid>

      <Grid
        item
        xs={6}
      >
        {project?.schema?.paths?.map((x, i) => (
          <FormConfigTab
            key={x.path + x.method}
            active={viewTab}
            tab={i}
            config={x}
          />
        ))}
      </Grid>
    </Grid>
  )
}

function AppWithProviders() {
  return (
    <ThemeProvider theme={theme}>
      <GeneratorProvider>
        <Router>
          <ProjectProvider>
            <App />
          </ProjectProvider>
        </Router>
      </GeneratorProvider>
    </ThemeProvider>
  )
}

function render() {
  const domNode = document.getElementById('root')
  const root = createRoot(domNode)
  root.render(<AppWithProviders />)
}

render()
