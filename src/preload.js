const { contextBridge, ipcRenderer } = require('electron');

// 将安全的 API 暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 接收模式信息
  receiveModeInfo: (callback) => ipcRenderer.on('mode-info', (event, info) => callback(info)),
  // 更改模式
  changeMode: (isDebugMode) => ipcRenderer.send('change-mode', isDebugMode),
  // 调整窗口大小
  resizeWindow: (dimensions) => ipcRenderer.send('resize-window', dimensions),
  // 移除监听器
  removeListeners: () => {
    ipcRenderer.removeAllListeners('mode-info');
  }
});