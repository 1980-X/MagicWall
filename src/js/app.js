// 导入Electron模块
const { app, BrowserWindow, dialog, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

// 导入模式相关配置和函数
const mode = require('./mode.js');
const { CONFIG } = mode;

// 布局验证器会通过preload脚本加载到渲染进程中

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
                enableRemoteModule: true,
                preload: path.join(__dirname, 'preload.js')
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

        // 监听来自渲染进程的切换模式请求
        ipcMain.on('switch-to-debug-mode', (event) => {
            console.log('收到切换到调试模式的请求');
            const debugSize = mode.calculateDebugWindowSize(screen);
            mainWindow.setSize(debugSize.width, debugSize.height);
            currentMode = 'debug';
            mainWindow.webContents.send('mode-changed', currentMode);
            // 通知渲染进程模式切换完成
            event.reply('debug-mode-switched');
        });

        // 监听来自布局验证器的日志消息
        ipcMain.on('layout-validator-log', (event, message, level = 'log') => {
            if (level === 'warn') {
                console.warn(`[布局验证器] ${message}`);
            } else if (level === 'error') {
                console.error(`[布局验证器] ${message}`);
            } else {
                console.log(`[布局验证器] ${message}`);
            }
        });

        // 在开发环境下验证布局一致性
        if (mode.isDevEnvironment()) {
            // 确保在开发环境下也能测试产品模式的布局
            if (currentMode !== 'production') {
                console.log('切换到产品模式以测试布局一致性...');
                currentMode = 'production';
                const productionSize = mode.calculateProductionWindowSize();
                mainWindow.setSize(productionSize.width, productionSize.height);
                mainWindow.webContents.send('mode-changed', currentMode);
            }
            
            setTimeout(() => {
                console.log('启动布局一致性验证...');
                // 由于验证器需要在渲染进程中运行，我们通过webContents执行脚本
                mainWindow.webContents.executeJavaScript(`
                    const layoutValidator = window.layoutValidator;
                    if (layoutValidator) {
                        layoutValidator.validateScreenRatio();
                        layoutValidator.startValidation();
                    } else {
                        console.error('布局验证器未加载');
                    }
                `);
            }, 1000);
        }
        
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