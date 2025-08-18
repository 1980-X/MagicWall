const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');

// 保持对窗口对象的全局引用，如果不这样做，当JavaScript对象被垃圾回收时，窗口将自动关闭
let mainWindow;

function createWindow(isDebugMode) {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: isDebugMode ? 1200 : 13570,  // 调试模式下使用较小窗口
    height: isDebugMode ? 800 : 1800,   // 产品模式下使用大屏幕尺寸
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    fullscreen: !isDebugMode,  // 产品模式下全屏
    frame: isDebugMode,        // 调试模式下显示窗口边框
    autoHideMenuBar: !isDebugMode,  // 产品模式下隐藏菜单栏
  });

  // 加载应用的 index.html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 向渲染进程发送模式信息
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('mode-info', { isDebugMode });
  });

  // 如果是调试模式，打开开发者工具
  if (isDebugMode) {
    mainWindow.webContents.openDevTools();
  }

  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    // 取消引用窗口对象，如果应用支持多窗口，通常会将多个窗口存储在数组中
    // 此时应该删除相应的元素
    mainWindow = null;
  });
}

function chooseMode() {
  // 解析命令行参数
  const isDebugMode = process.argv.includes('--debug');
  const isProductMode = process.argv.includes('--product');

  // 如果指定了模式参数，直接使用该模式
  if (isDebugMode) {
    createWindow(true);
    return;
  }

  if (isProductMode) {
    createWindow(false);
    return;
  }

  // 如果没有指定模式参数，显示模式选择对话框
  dialog.showMessageBox({
    type: 'question',
    buttons: ['开发模式', '产品模式'],
    title: '选择模式',
    message: '请选择运行模式',
    detail: '开发模式：适合开发人员调试\n产品模式：针对大屏幕展示优化'
  }).then((result) => {
    // 0: 开发模式, 1: 产品模式
    createWindow(result.response === 0);
  }).catch(err => {
    console.error(err);
    // 出错时默认使用开发模式
    createWindow(true);
  });
}

// Electron 会在初始化后并准备创建浏览器窗口时调用这个函数
// 部分 API 在 ready 事件触发后才能使用
app.on('ready', chooseMode);

// 当所有窗口都关闭时退出
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大多数应用及其菜单栏会保持激活
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，通常会在应用中重新创建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

// 在这个文件中，可以包含应用剩下的所有主进程代码
// 也可以拆分成几个文件，然后用 require 导入

// 处理来自渲染进程的消息
ipcMain.on('change-mode', (event, isDebugMode) => {
  // 重新创建窗口以应用新模式
  if (mainWindow) {
    mainWindow.close();
  }
  createWindow();
});

// 处理窗口尺寸调整请求
ipcMain.on('resize-window', (event, { width, height }) => {
  if (mainWindow) {
    mainWindow.setSize(width, height);
  }
});