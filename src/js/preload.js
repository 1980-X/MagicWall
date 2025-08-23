// preload.js - 用于在渲染进程和主进程之间安全通信
const { contextBridge, ipcRenderer } = require('electron');
console.log('preload.js 已加载');

// 尝试加载布局验证器
let layoutValidator;
try {
    layoutValidator = require('./layoutValidator');
    console.log('布局验证器已成功加载');
} catch (error) {
    console.error('加载布局验证器时出错:', error);
}

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld('layoutValidator', {
    validateScreenRatio: () => {
        if (layoutValidator) {
            console.log('调用 validateScreenRatio');
            return layoutValidator.validateScreenRatio();
        } else {
            console.error('布局验证器未加载，无法调用 validateScreenRatio');
        }
    },
    startValidation: () => {
        if (layoutValidator) {
            console.log('调用 startValidation');
            return layoutValidator.startValidation();
        } else {
            console.error('布局验证器未加载，无法调用 startValidation');
        }
    }
});

// 监听来自主进程的消息
ipcRenderer.on('mode-changed', (event, mode) => {
    console.log(`模式已更改为: ${mode}`);
    // 可以在这里添加模式更改时的处理逻辑
});

// 监听来自主进程的调试模式切换完成消息
ipcRenderer.on('debug-mode-switched', () => {
    console.log('调试模式切换完成');
});