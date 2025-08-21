const { app, BrowserWindow, dialog, screen } = require('electron');
// 导入Electron模块
const { app, BrowserWindow, dialog, screen } = require('electron');
const path = require('path');
const url = require('url');

// 导入模式相关配置和函数
const mode = require('./mode.js');
const { CONFIG } = mode;

let mainWindow;
let currentMode = null;

// 创建主窗口的函数
function createMainWindow() {
    if (mainWindow) {
        // 如果窗口已存在，先关闭它
        mainWindow.close();
        mainWindow = null;
    }
    
    // 首先显示模式选择对话框
    showModeSelectionDialog().then((selectedMode) => {
        if (!selectedMode) {
            // 用户取消选择，退出应用
            app.quit();
            return;
        }
        
        currentMode = selectedMode;
        
        // 根据选择的模式设置窗口尺寸
        const windowSize = mode.adjustWindowSizeForScreen({ screen }, currentMode);
        
        // 创建浏览器窗口
        mainWindow = new BrowserWindow({
            width: windowSize.width,
            height: windowSize.height,
            frame: false, // 无边框窗口
            title: 'MagicWall',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        
        // 加载应用的 index.html
        const startUrl = url.format({
            pathname: path.join(__dirname, '../index.html'),
            protocol: 'file:',
            slashes: true
        });
        mainWindow.loadURL(startUrl);
        
        // 根据环境变量和模式决定是否打开开发者工具
        if (currentMode === 'debug' && mode.shouldOpenDevTools()) {
            mainWindow.webContents.openDevTools();
        }
        
        // 窗口关闭时的处理
        mainWindow.on('closed', function () {
            mainWindow = null;
        });
        
        // 监听窗口大小变化，保持比例一致
        mainWindow.on('resize', () => {
            // 这里可以添加保持比例的逻辑，但对于用户调整窗口大小可能会有些复杂
            // 在实际应用中可能需要考虑是否允许用户调整窗口大小
        });
        
        // 向渲染进程传递当前模式信息
        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.webContents.send('mode-changed', currentMode);
        });
        
    }).catch(err => {
        console.error('选择模式时出错:', err);
        app.quit();
    });
}

// 显示模式选择对话框，支持自动检测推荐
function showModeSelectionDialog() {
    return new Promise((resolve) => {
        // 自动检测适合的模式
        const recommendedMode = mode.detectModeAutomatically(screen);
        const defaultButtonId = recommendedMode === 'production' ? 1 : 0;
        const detailText = `推荐模式: ${recommendedMode === 'production' ? '产品模式' : '调试模式'}\n\n` +
                          '调试模式：适用于开发人员，窗口尺寸较小\n产品模式：适用于最终展示，窗口尺寸较大' + 
                          '\n\n注意：两种模式下的界面布局、图文和动画位置完全一致，仅窗口尺寸不同。';
        
        dialog.showMessageBox({
            type: 'question',
            title: '选择运行模式',
            message: '请选择MagicWall的运行模式:',
            buttons: ['调试模式', '产品模式', '取消'],
            defaultId: defaultButtonId,
            cancelId: 2,
            detail: detailText
        }).then(result => {
            if (result.response === 0) {
                resolve('debug');
            } else if (result.response === 1) {
                resolve('production');
            } else {
                resolve(null);
            }
        }).catch(() => {
            resolve(null);
        });
    });
}

// 导出createMainWindow函数供index.js使用
module.exports = {
    createMainWindow
};