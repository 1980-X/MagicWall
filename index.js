// 最简化的MagicWall应用入口
const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

// 导入模式配置模块
const modeConfig = require('./src/js/mode');

// 全局变量用于存储当前应用模式
let currentMode = null;

let mainWindow;

function createWindow() {
    // 根据屏幕尺寸自动检测应该使用的模式
    currentMode = modeConfig.detectModeAutomatically(screen);
    
    // 如果不是自动模式，使用环境变量判断
    if (!modeConfig.CONFIG.AUTO_MODE_ENABLED) {
        currentMode = modeConfig.isDevEnvironment() ? 'debug' : 'production';
    }
    
    // 计算窗口尺寸，确保比例与物理屏幕一致
    let windowSize;
    if (currentMode === 'debug') {
        // 调试模式下，使用根据屏幕调整的窗口尺寸，确保不会超出屏幕大小
        windowSize = modeConfig.adjustWindowSizeForScreen({ screen }, 'debug');
    } else {
        // 产品模式下，使用实际屏幕尺寸
        windowSize = modeConfig.calculateProductionWindowSize();
    }
    
    // 创建一个无边框的浏览器窗口，尺寸根据应用需求设置
    mainWindow = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
        frame: false,  // 移除标题栏
        title: 'MagicWall',
        resizable: false,  // 禁止调整窗口尺寸
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    
    // 确保不显示控制台
    // 移除了根据环境变量和模式决定是否打开开发者工具的逻辑
    // 始终不打开开发者工具


    // 加载应用的 index.html
    mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

    // 窗口关闭时的处理
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    
    // 向渲染进程传递当前模式信息
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('mode-changed', currentMode);
    });
}

// 应用就绪后创建窗口
app.on('ready', createWindow);

// 所有窗口关闭时退出应用（除了macOS）
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// macOS上点击Dock图标时创建窗口
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});