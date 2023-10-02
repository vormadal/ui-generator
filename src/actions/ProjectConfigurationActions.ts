import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
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
    const content = await readFilePromise(location)
    return JSON.parse(content)
  }

  handleSave = async (e: Electron.IpcMainInvokeEvent, config: ProjectConfiguration): Promise<void> => {
    console.log('saving project', config)
    if (!config) return
    const location = this.getPath(config.id)
    // const dir = location.substring(0, location.lastIndexOf('/'))
    // console.log('dir', dir)
    // if (!existsSync(dir)) {
    //   mkdirSync(dir, { recursive: true })
    // }
    await writeFilePromise(location, JSON.stringify(config))
  }
}

export default new ProjectConfigurationActions()
