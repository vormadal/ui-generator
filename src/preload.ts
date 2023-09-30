// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { GeneratorOptions } from './configuration/GeneratorOptions';

contextBridge.exposeInMainWorld('electronAPI', {
  selectProject: async () => ipcRenderer.invoke('dialog:selectProject'),
  getFormData: async (id: string) => ipcRenderer.invoke('load:form', id),
  saveFormData: async (form: GeneratorOptions) => ipcRenderer.invoke('save:form', form)
})
