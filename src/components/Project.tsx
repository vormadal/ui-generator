import { Search } from '@mui/icons-material'
import {
  Button,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { CodeGenerator } from '../configuration/CodeGenerator'
import { useGenerator } from '../contexts/GeneratorContext'
import generators from '../generators'
import SystemConfiguration from '../system/SystemConfiguration'
import ProjectConfiguration from '../system/ProjectConfiguration'

function Project() {
  const [systemConfig, setSystemConfig] = useState<SystemConfiguration>()
  const [project, setProject] = useState<ProjectConfiguration>()
  const [generator, setGenerator] = useGenerator()

  async function handleProjectChange(e: SelectChangeEvent) {
    const projectRef = systemConfig.projects.find((x) => x.id === e.target.value)
    const project = await window.electronAPI.getProject(projectRef.id)
    setProject(project)
    setSystemConfig((x) => ({ ...x, lastProject: project.id }))
  }
  async function handleProjectDirectoryChange() {
    const filePath = await window.electronAPI.selectProject()
    setProject((x) => ({ ...x, projectDirectory: filePath }))
  }

  async function handleProjectNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProject((x) => ({ ...x, name: e.target.value }))

    const projects = systemConfig.projects
    projects.splice(
      projects.findIndex((x) => x.id === project.id),
      1,
      { ...project, name: e.target.value }
    )
    setSystemConfig((x) => ({ ...x, projects }))
  }

  useEffect(() => {
    async function initialize() {
      const config = await window.electronAPI.getSystemConfiguration()
      if (config.lastProject) {
        const project = await window.electronAPI.getProject(config.lastProject)
        setProject(project)
      }
      setSystemConfig(config)
    }

    initialize()

    async function save() {
      if (systemConfig) window.electronAPI.saveSystemConfiguration(systemConfig)
      if (project) window.electronAPI.saveProject(project)
    }

    const handle = setInterval(save, 30000)

    return () => {
      if (systemConfig) window.electronAPI.saveSystemConfiguration(systemConfig)
      if (project) window.electronAPI.saveProject(project)
      clearInterval(handle)
    }
  }, [])

  async function handleGenerate() {
    // await window.electronAPI.writeFiles()
  }

  async function handleCreateProject() {
    const project = new ProjectConfiguration()
    setSystemConfig((x) => ({ ...x, projects: [...x.projects, project] }))
    setProject(project)
  }

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ marginBottom: '1rem' }}
      >
        <Grid
          item
          xs={6}
        >
          <FormControl
            fullWidth
            sx={{ marginTop: '1rem' }}
          >
            <InputLabel id="select-project-label">Project</InputLabel>
            <Select
              labelId="select-project-label"
              id="select-project"
              value={project?.id ?? ''}
              onChange={handleProjectChange}
            >
              {systemConfig?.projects.map((x) => (
                <MenuItem
                  key={x.id}
                  value={x.id}
                >
                  {x.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleCreateProject}>New project</Button>
        </Grid>
        <Grid
          item
          xs={6}
        />
      </Grid>
      <Collapse in={!!project}>
        <Grid
          container
          spacing={2}
          sx={{ marginBottom: '1rem' }}
        >
          <Grid
            item
            xs={6}
          >
            <TextField
              fullWidth
              value={project?.name}
              onChange={handleProjectNameChange}
            />
            <TextField
              disabled
              fullWidth
              value={project?.projectDirectory || ''}
              label="Project Directory"
              placeholder="Path"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleProjectDirectoryChange}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid
            item
            xs={3}
          >
            <TextField
              fullWidth
              value={project?.openapiSpecPath || ''}
              label="OpenAPI definition"
              placeholder="File or URL"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid
            item
            xs={3}
          >
            <FormControl
              fullWidth
              sx={{ marginTop: '1rem' }}
            >
              <InputLabel id="select-generator-label">Generator</InputLabel>
              <Select
                labelId="select-generator-label"
                id="select-generator"
                value={generator?.name ?? ''}
                onChange={(e) => setGenerator(generators.options.find((x) => x.name === e.target.value))}
              >
                {generators.options.map((x) => (
                  <MenuItem
                    key={x.name}
                    value={x.name}
                  >
                    {x.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={3}
          >
            <Button onClick={handleGenerate}>Generate files</Button>
          </Grid>
        </Grid>
      </Collapse>
    </>
  )
}

export default Project
