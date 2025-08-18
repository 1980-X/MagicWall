const { contextBridge, ipcRenderer } = require('electron');

// 将ipcRenderer API暴露给渲染进程，但只提供必要的方法
contextBridge.exposeInMainWorld('electronAPI', {
  selectMode: () => ipcRenderer.send('select-mode'),
  onModeSelected: (callback) => ipcRenderer.on('mode-selected', (event, data) => callback(data)),
  onModeInfo: (callback) => ipcRenderer.on('mode-info', (event, data) => callback(data)),
  // 可以在这里添加更多需要暴露的API方法
});

// 可以在这里添加其他预加载逻辑，这些逻辑会在渲染进程的JavaScript执行前运行