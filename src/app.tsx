import { Grid, Tab, Tabs, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter as Router } from 'react-router-dom'
import FormConfigTab from './components/FormConfigTab'
import Project from './components/Project'
import { ProjectProvider, useProject } from './contexts/ProjectContext'
import { theme } from './utils/theme'
import { GeneratorProvider } from './contexts/GeneratorContext'
import { FormOptions } from './configuration/FormOptions'
import generators from './generators'
import ReactMuiFormikGenerator from './generators/react-mui-formik'
import { ExtendedOperationObject } from './openApi/ExtendedOperationObject'

generators.configure(new ReactMuiFormikGenerator())

function App() {
  const [project] = useProject()
  const [activeGroup, setActiveGroup] = useState('')
  const [groupTab, setGroupTab] = useState(0)
  const [formTab, setFormTab] = useState(0)
  const [forms, setForms] = useState<ExtendedOperationObject[]>([])

  useEffect(() => {
    if (!project?.schema?.groupNames?.length) return
    setActiveGroup(project?.schema.groupNames[0])
  }, [project])

  useEffect(() => {
    if (!activeGroup) return
    setForms(project?.schema?.getGroupItems(activeGroup))
    setFormTab(0)
  }, [project, activeGroup])

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
          value={groupTab}
          onChange={(e, v) => setGroupTab(v)}
        >
          {project?.schema?.groupNames?.map((x) => (
            <Tab
              key={x}
              onClick={() => setActiveGroup(x)}
              label={x}
            />
          ))}
        </Tabs>
      </Grid>

      <Grid
        item
        xs={6}
      >
        <Tabs
          value={formTab}
          onChange={(e, v) => setFormTab(v)}
          aria-label="form type"
        >
          {forms.map((x) => (
            <Tab
              key={x.path + x.method}
              id={x.method + x.path}
              label={new FormOptions(x).name}
            />
          ))}
        </Tabs>

        {forms.map((x, i) => (
          <FormConfigTab
            key={x.path + x.method}
            active={formTab}
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
