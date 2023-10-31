// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import ProjectConfiguration from './system/ProjectConfiguration'
import SystemConfiguration from './system/SystemConfiguration'

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemConfiguration: async () => ipcRenderer.invoke('config:system:get'),
  saveSystemConfiguration: async (config: SystemConfiguration) => ipcRenderer.invoke('config:system:save', config),

  getProject: async (id: string) => ipcRenderer.invoke('config:project:get', id),
  saveProject: async (config: ProjectConfiguration) => ipcRenderer.invoke('config:project:save', config),

  selectFile: async () => ipcRenderer.invoke('dialog:select:file'),
  selectDirectory: async () => ipcRenderer.invoke('dialog:select:directory'),

  readFile: async (path: string) => ipcRenderer.invoke('file:read', path),
  writeFile: async (path: string, content: string) => ipcRenderer.invoke('file:write', path, content),

  runScript: async (directory: string, command: string) => ipcRenderer.invoke('script:run', directory, command)
})
