import { app } from 'electron'
import path from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'

import SystemConfiguration from '../system/SystemConfiguration'

class SystemConfigurationActions {
  configure(ipcMain: Electron.IpcMain) {
    ipcMain.handle('config:system:get', this.handleGet)
    ipcMain.handle('config:system:save', this.handleSave)
  }

  getPath = () => {
    return path.join(app.getPath('userData'), 'config.json')
  }

  handleGet = (e: Electron.IpcMainInvokeEvent): SystemConfiguration => {
    const location = this.getPath()
    if (existsSync(location)) {
      const content = readFileSync(location, { encoding: 'utf-8' })
      return JSON.parse(content)
    }

    return new SystemConfiguration()
  }

  handleSave = (e: Electron.IpcMainInvokeEvent, config: SystemConfiguration) => {
    console.log('saving system config', config)
    if (!config) return

    const location = this.getPath()
  
    writeFileSync(location, JSON.stringify(config))
  }
}

export default new SystemConfigurationActions()
