import { BrowserWindow, dialog } from 'electron'


class DialogActions {
  configure(ipcMain: Electron.IpcMain, window: BrowserWindow) {
    ipcMain.handle('dialog:select:file', this.handleFile(window))
    ipcMain.handle('dialog:select:directory', this.handleDirectory(window))
  }

  handleFile = (window: BrowserWindow) => async (): Promise<string> => {
    const { canceled, filePaths } = await dialog.showOpenDialog(window)
    if (!canceled) {
      return filePaths[0]
    }

    return ''
  }

  handleDirectory = (window: BrowserWindow) => async (): Promise<string> => {
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    })
    if (!canceled) {
      return filePaths[0]
    }
    return ''
  }
}

export default new DialogActions()
