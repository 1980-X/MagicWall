// MagicWall应用入口
const { app } = require('electron');

// 导入app.js中的createMainWindow函数
const { createMainWindow } = require('./src/js/app');

// 创建窗口的函数
function createWindow() {
    createMainWindow();
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