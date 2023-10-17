import { app } from 'electron'
import path from 'path'

import ProjectConfiguration from '../system/ProjectConfiguration'
import { readFilePromise, writeFilePromise } from './FileActions'

class ProjectConfigurationActions {
  configure(ipcMain: Electron.IpcMain) {
    ipcMain.handle('config:project:get', this.handleGet)
    ipcMain.handle('config:project:save', this.handleSave)
  }

  getPath = (id: string) => {
    return path.join(app.getPath('userData'), `${id}.json`)
  }

  handleGet = async (e: Electron.IpcMainInvokeEvent, id: string): Promise<ProjectConfiguration> => {
    const location = this.getPath(id)
    const json = await readFilePromise(location)
    return JSON.parse(json)
  }

  handleSave = async (e: Electron.IpcMainInvokeEvent, config: ProjectConfiguration): Promise<void> => {
    if (!config) return
    const location = this.getPath(config.id)
    await writeFilePromise(location, JSON.stringify(config))
  }
}

export default new ProjectConfigurationActions()
