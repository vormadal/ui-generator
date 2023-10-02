import { readFile, writeFile } from 'fs'

export async function readFilePromise(path: string): Promise<string> {
  return await new Promise((resolve, error) => {
    readFile(path, 'utf-8', (err, data) => {
      if (err) {
        error(err)
      } else {
        resolve(data)
      }
    })
  })
}

export async function writeFilePromise(path: string, content: string): Promise<void> {
  return await new Promise((resolve, error) => {
    writeFile(path, content, { encoding: 'utf-8' }, (err) => {
      if (err) {
        error(err)
      } else {
        resolve()
      }
    })
  })
}

class FileActions {
  configure(ipcMain: Electron.IpcMain) {
    ipcMain.handle('file:read', this.handleRead)
    ipcMain.handle('file:write', this.handleWrite)
  }

  handleRead = async (_: Electron.IpcMainInvokeEvent, path: string): Promise<string> => {
    return await readFilePromise(path)
  }

  handleWrite = async (_: Electron.IpcMainInvokeEvent, path: string, content: string): Promise<void> => {
    return await writeFilePromise(path, content)
  }
}

export default new FileActions()
