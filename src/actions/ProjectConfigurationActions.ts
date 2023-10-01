import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

import ProjectConfiguration from '../system/ProjectConfiguration'

class ProjectConfigurationActions {
  configure(ipcMain: Electron.IpcMain) {
    ipcMain.handle('config:project:get', this.handleGet)
    ipcMain.handle('config:project:save', this.handleSave)
  }

  getPath = (id: string) => {
    return path.join(app.getPath('userData'), `${id}.json`)
  }

  handleGet = (e: Electron.IpcMainInvokeEvent, id: string): ProjectConfiguration => {
    const location = this.getPath(id)
    const content = readFileSync(location, { encoding: 'utf-8' })
    return JSON.parse(content)
  }

  handleSave = (e: Electron.IpcMainInvokeEvent, config: ProjectConfiguration) => {
    console.log('saving project', config)
    if (!config) return
    const location = this.getPath(config.id)
    // const dir = location.substring(0, location.lastIndexOf('/'))
    // console.log('dir', dir)
    // if (!existsSync(dir)) {
    //   mkdirSync(dir, { recursive: true })
    // }
    writeFileSync(location, JSON.stringify(config))
  }
}

export default new ProjectConfigurationActions()
