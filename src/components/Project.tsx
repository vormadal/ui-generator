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
import React, { useEffect, useState } from 'react'
import { useGenerator } from '../contexts/GeneratorContext'
import { useProject } from '../contexts/ProjectContext'
import generators from '../generators'
import OpenApiSchema from '../openApi/OpenApiSchema'
import ProjectConfiguration from '../system/ProjectConfiguration'
import SystemConfiguration from '../system/SystemConfiguration'
import axios from 'axios'

function formatPath(path: string) {
  const delimiter = path.includes('/') ? '/' : '\\'

  const end = path.substring(path.lastIndexOf(delimiter) + 1)
  const start = path.substring(0, path.indexOf(delimiter, 5))

  return `${start}\\..\\${end}`
}

function Project() {
  const [systemConfig, setSystemConfig] = useState<SystemConfiguration>()
  const [generator, setGenerator] = useGenerator()
  const [project, setProject] = useProject()

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
        if (project.spec && project.selectedGenerator) {
          const generator = generators.options.find((x) => x.name === project.selectedGenerator)
          //TODO fix this - data stored in files should be simple - not containing any functions etc
          project.schema = new OpenApiSchema(project.spec, generator)
        }
        setProject(project)
      }
      setSystemConfig(config)
    }

    initialize()
  }, [])

  useEffect(() => {
    if (project && project.selectedGenerator !== generator?.name) {
      setGenerator(generators.options.find((x) => x.name === project.selectedGenerator))
    }
  }, [project?.selectedGenerator])

  async function handleProjectChange(e: SelectChangeEvent) {
    const projectRef = systemConfig.projects.find((x) => x.id === e.target.value)
    const project = await window.electronAPI.getProject(projectRef.id)
    if (project.spec && project.selectedGenerator) {
      const generator = generators.options.find((x) => x.name === project.selectedGenerator)
      //TODO fix this - data stored in files should be simple - not containing any functions etc
      project.schema = new OpenApiSchema(project.spec, generator)
    }
    setProject(project)
    setSystemConfig((x) => ({ ...x, lastProject: project.id }))
  }

  async function handleProjectDirectoryChange() {
    const filePath = await window.electronAPI.selectDirectory()
    setProject((x) => ({ ...x, projectDirectory: filePath }))
  }

  async function handleGenerate() {
    const content = generator.generate(project.schema.paths, false, project)
    const files = content.filter(x => x.type === 'file')
    const scripts = content.filter(x => x.type === 'script')

    for(const script of scripts){
      console.log('running script', script.name)
      await window.electronAPI.runScript(project.projectDirectory, script.content)
    }    
    const promises = files.map((x) => window.electronAPI.writeFile(`${project.projectDirectory}/${x.name}`, x.content))
    await Promise.all(promises)
  }

  async function handleCreateProject() {
    const project = new ProjectConfiguration()
    setSystemConfig((x) => ({ ...x, projects: [...x.projects, project] }))
    setProject(project)
  }

  async function handleUpdateSpecDefinition() {
    const file = await window.electronAPI.selectFile()
    const content = await window.electronAPI.readFile(file)
    const spec = JSON.parse(content)
    setProject((x) => ({ ...x, openapiSpecPath: file, spec, schema: new OpenApiSchema(spec, generator) }))
  }

  async function handleOpenApiSpecChange(e: React.ChangeEvent<HTMLInputElement>) {
    const path = e.target.value
    if (!path || !path.startsWith('http')) {
      return
    }
    try {
      const result = await axios.get(e.target.value, {
        
      })
      console.log('result', result.data)
    } catch (e) {
      console.log('axios error', e)
      return
    }
    setProject((x) => ({
      ...x,
      openapiSpecPath: e.target.value
    }))
  }

  async function handleSave() {
    if (systemConfig) window.electronAPI.saveSystemConfiguration(systemConfig)
    
    if (project){
      const copy = JSON.parse(JSON.stringify(project))
      window.electronAPI.saveProject(copy)
    } 
  }

  async function handleGeneratorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProject((x) => ({ ...x, selectedGenerator: e.target.value }))
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
        >
          <Button
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>
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
              value={project?.name || ''}
              onChange={handleProjectNameChange}
            />
            <TextField
              disabled
              fullWidth
              value={formatPath(project?.projectDirectory || '')}
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
              value={formatPath(project?.openapiSpecPath || '')}
              onChange={handleOpenApiSpecChange}
              label="OpenAPI definition"
              placeholder="File or URL"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleUpdateSpecDefinition}
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
            <FormControl
              fullWidth
              sx={{ marginTop: '1rem' }}
            >
              <InputLabel id="select-generator-label">Generator</InputLabel>
              <Select
                labelId="select-generator-label"
                id="select-generator"
                value={generator?.name ?? ''}
                onChange={handleGeneratorChange}
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
