const { app, BrowserWindow, ipcMain, dialog, screen } = require('electron');
const path = require('path');
const { modeConfig, getDebugWindowSize, getProductWindowSize } = require('./js/mode');

// 保持对window对象的全局引用，如果不这样做，当JavaScript对象被垃圾回收时，window将会自动关闭
let mainWindow;

// 调整窗口尺寸以适应屏幕
function adjustWindowSizeForScreen(windowSize) {
  // 获取主显示屏的尺寸
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  
  // 如果窗口尺寸超出屏幕尺寸，则按比例缩小
  if (windowSize.width > screenWidth || windowSize.height > screenHeight) {
    const widthRatio = screenWidth / windowSize.width;
    const heightRatio = screenHeight / windowSize.height;
    const scale = Math.min(widthRatio, heightRatio) * 0.9; // 保留一些边距
    
    windowSize.width = Math.round(windowSize.width * scale);
    windowSize.height = Math.round(windowSize.height * scale);
  }
  
  return windowSize;
}

function createWindow() {
  // 获取命令行参数，检查是否启用调试模式
  const isDebugMode = process.env.DEBUG_MODE === 'true';
  
  // 根据模式获取窗口尺寸
  let windowSize;
  if (isDebugMode) {
    windowSize = getDebugWindowSize();
  } else {
    windowSize = getProductWindowSize();
  }
  
  // 调整窗口尺寸以适应屏幕
  windowSize = adjustWindowSizeForScreen(windowSize);

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: true, // 始终允许调整窗口大小
    fullscreen: false, // 不默认进入全屏模式
    autoHideMenuBar: true, // 隐藏菜单栏
    frame: false, // 移除窗口边框
  });

  // 添加窗口大小改变监听器，保持比例
  let isResizing = false;
  mainWindow.on('resize', () => {
    if (!isResizing) {
      isResizing = true;
      
      const [width, height] = mainWindow.getSize();
      const currentRatio = width / height;
      const targetRatio = modeConfig.SCREEN_RATIO;
      
      // 如果当前比例与目标比例相差超过0.1，则调整大小以保持比例
      if (Math.abs(currentRatio - targetRatio) > 0.1) {
        // 以高度为基准调整宽度
        const newWidth = Math.round(height * targetRatio);
        mainWindow.setSize(newWidth, height, true);
      }
      
      setTimeout(() => {
        isResizing = false;
      }, 10);
    }
  });

  // 加载index.html文件
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 在调试模式下打开开发者工具
  // 可以通过设置环境变量 OPEN_DEV_TOOLS=false 来禁用
  if (isDebugMode && process.env.OPEN_DEV_TOOLS !== 'false') {
    mainWindow.webContents.openDevTools();
  }

  // 当window被关闭时触发以下事件
  mainWindow.on('closed', () => {
    // 取消引用window对象，如果你的应用支持多窗口，通常会把多个window对象存放在一个数组中
    // 与此同时，你应该删除相应的元素
    mainWindow = null;
  });

  // 向渲染进程发送当前模式信息
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('mode-info', {
      isDebugMode: isDebugMode,
      windowWidth: windowSize.width,
      windowHeight: windowSize.height
    });
  });
}

// 当Electron完成初始化并准备创建浏览器窗口时，将调用此方法
// 部分API只能在这个事件发生后使用
app.on('ready', createWindow);

// 当所有窗口都关闭时退出应用
app.on('window-all-closed', () => {
  // 在macOS上，除非用户用Cmd+Q确定退出，否则应用及菜单栏会保持活动状态
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当点击dock图标并且没有其他窗口打开时，通常会在应用中重新创建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

// 在这个文件中，你可以包含应用剩余的所有主进程代码
// 也可以拆分成几个文件，然后用require导入

// 模式选择对话框（如果没有通过环境变量指定模式）
function showModeSelectionDialog() {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['调试模式', '产品模式'],
    title: '选择运行模式',
    message: '请选择MagicWall的运行模式',
    detail: '调试模式：适合开发人员，窗口可调整大小\n产品模式：针对9.05m×1.80m大型屏幕优化'
  }).then((result) => {
    // 设置环境变量
    process.env.DEBUG_MODE = result.response === 0 ? 'true' : 'false';
    // 重新调用createWindow函数
    createWindow();
  });
}

ipcMain.on('select-mode', (event) => {
  showModeSelectionDialog();
});