import { exec } from 'child_process'
import util from 'node:util'
const asyncExec = util.promisify(exec)

class ScriptActions {
  configure(ipcMain: Electron.IpcMain) {
    ipcMain.handle('script:run', this.handleRun)
  }

  handleRun = async (_: Electron.IpcMainInvokeEvent, directory: string, command: string): Promise<void> => {
    const { stderr, stdout } = await asyncExec(command, {
      cwd: directory,
      windowsHide: true
    })

    console.log('stdout', stdout)
    console.log('stderr', stderr)
  }
}

export default new ScriptActions()
