// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import { GeneratorOptions } from './configuration/GeneratorOptions'
import SystemConfiguration from './system/SystemConfiguration'
import ProjectConfiguration from './system/ProjectConfiguration'

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemConfiguration: async () => ipcRenderer.invoke('config:system:get'),
  saveSystemConfiguration: async (config: SystemConfiguration) => ipcRenderer.invoke('config:system:save', config),

  getProject: async (id: string) => ipcRenderer.invoke('config:project:get', id),
  saveProject: async (config: ProjectConfiguration) => ipcRenderer.invoke('config:project:save', config),

  selectProject: async () => ipcRenderer.invoke('dialog:selectProject'),
  getFormData: async (id: string) => ipcRenderer.invoke('load:form', id),
  saveFormData: async (form: GeneratorOptions) => ipcRenderer.invoke('save:form', form)
})
