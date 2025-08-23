// 布局验证器 - 确保调试模式和产品模式下的布局一致性
const { ipcRenderer } = require('electron');
const mode = require('./mode');
const { CONFIG } = mode;

// 发送日志到主进程
function logToMainProcess(message, level = 'log') {
    ipcRenderer.send('layout-validator-log', message, level);
}

class LayoutValidator {
    // 验证屏幕比例
    validateScreenRatio() {
        const { width, height } = window.innerSize;
        const currentRatio = width / height;
        const targetRatio = CONFIG.SCREEN_RATIO;
        const difference = Math.abs(currentRatio - targetRatio);

        logToMainProcess(`当前窗口比例: ${currentRatio.toFixed(4)}, 目标比例: ${targetRatio.toFixed(4)}`);
        if (difference < 0.01) {
            logToMainProcess('✅ 窗口比例正确!');
        } else {
            logToMainProcess(`❌ 窗口比例不正确，偏差: ${(difference * 100).toFixed(2)}%`, 'warn');
        }
    }
    constructor() {
        this.productionModeElements = {};
        this.debugModeElements = {};
        this.isValidating = false;
        this.currentMode = null;

        // 监听模式变化
        ipcRenderer.on('mode-changed', (event, mode) => {
            this.currentMode = mode;
            logToMainProcess(`布局验证器: 模式已更改为 ${mode}`);
        });

        // 监听调试模式切换完成事件
        ipcRenderer.on('debug-mode-switched', () => {
            logToMainProcess('布局验证器: 调试模式切换完成');
            if (this.isValidating) {
                setTimeout(() => {
                    this.captureCurrentLayout('debug');
                    this.compareLayouts();
                    this.isValidating = false;
                }, 1000);
            }
        });
    }

    // 开始验证模式
    startValidation() {
        if (this.isValidating) {
            logToMainProcess('验证已在进行中，请勿重复调用');
            return;
        }

        if (this.currentMode !== 'production') {
            logToMainProcess('只能从产品模式开始验证');
            return;
        }

        this.isValidating = true;
        logToMainProcess('=== 开始布局一致性验证 ===');
        this.captureCurrentLayout('production');

        // 请求主进程切换到调试模式
        ipcRenderer.send('switch-to-debug-mode');
        logToMainProcess('已请求切换到调试模式，等待响应...');
    }

    // 捕获当前模式下的布局信息
    captureCurrentLayout(modeName) {
        logToMainProcess(`捕获${modeName}模式下的布局信息...`);
        const elements = document.querySelectorAll('*');
        const layoutInfo = {};

        elements.forEach(el => {
            if (el.id) {
                const rect = el.getBoundingClientRect();
                layoutInfo[el.id] = {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom,
                    // 计算相对位置和尺寸
                    relWidth: rect.width / window.innerWidth,
                    relHeight: rect.height / window.innerHeight,
                    relTop: rect.top / window.innerHeight,
                    relLeft: rect.left / window.innerWidth
                };
            }
        });

        if (modeName === 'production') {
            this.productionModeElements = layoutInfo;
            logToMainProcess(`已捕获产品模式下的 ${Object.keys(layoutInfo).length} 个元素信息`);
        } else {
            this.debugModeElements = layoutInfo;
            logToMainProcess(`已捕获调试模式下的 ${Object.keys(layoutInfo).length} 个元素信息`);
        }
    }

    // 比较两种模式下的布局
    compareLayouts() {
        logToMainProcess('=== 比较两种模式下的布局 ===');
        const productionElements = this.productionModeElements;
        const debugElements = this.debugModeElements;
        const tolerance = 0.02; // 2% 的容差
        let allMatch = true;

        // 检查元素数量是否一致
        if (Object.keys(productionElements).length !== Object.keys(debugElements).length) {
            logToMainProcess(`两种模式下的元素数量不一致: 产品=${Object.keys(productionElements).length}, 调试=${Object.keys(debugElements).length}`, 'warn');
            allMatch = false;
        }

        // 比较所有在两种模式下都存在的元素
        Object.keys(productionElements).forEach(id => {
            if (debugElements[id]) {
                const prod = productionElements[id];
                const debug = debugElements[id];

                // 检查相对尺寸和位置是否一致
                const widthMatch = Math.abs(prod.relWidth - debug.relWidth) < tolerance;
                const heightMatch = Math.abs(prod.relHeight - debug.relHeight) < tolerance;
                const topMatch = Math.abs(prod.relTop - debug.relTop) < tolerance;
                const leftMatch = Math.abs(prod.relLeft - debug.relLeft) < tolerance;

                if (!widthMatch || !heightMatch || !topMatch || !leftMatch) {
                    logToMainProcess(`元素 ${id} 在两种模式下不一致:`, 'warn');
                    if (!widthMatch) logToMainProcess(`  - 宽度比例: 产品=${prod.relWidth.toFixed(4)}, 调试=${debug.relWidth.toFixed(4)}`, 'warn');
                    if (!heightMatch) logToMainProcess(`  - 高度比例: 产品=${prod.relHeight.toFixed(4)}, 调试=${debug.relHeight.toFixed(4)}`, 'warn');
                    if (!topMatch) logToMainProcess(`  - 顶部比例: 产品=${prod.relTop.toFixed(4)}, 调试=${debug.relTop.toFixed(4)}`, 'warn');
                    if (!leftMatch) logToMainProcess(`  - 左侧比例: 产品=${prod.relLeft.toFixed(4)}, 调试=${debug.relLeft.toFixed(4)}`, 'warn');
                    allMatch = false;
                }
            } else {
                logToMainProcess(`元素 ${id} 在调试模式下不存在`, 'warn');
                allMatch = false;
            }
        });

        // 检查调试模式下有但产品模式下没有的元素
        Object.keys(debugElements).forEach(id => {
            if (!productionElements[id]) {
                logToMainProcess(`元素 ${id} 在产品模式下不存在`, 'warn');
                allMatch = false;
            }
        });

        if (allMatch) {
            logToMainProcess('✅ 所有元素在两种模式下保持一致!');
        } else {
            logToMainProcess('❌ 发现布局不一致的元素，请查看上面的警告信息。');
        }
    }

    // 验证屏幕比例
    validateScreenRatio() {
        const currentWindow = require('electron').remote.getCurrentWindow();
        const { width, height } = currentWindow.getBounds();
        const currentRatio = width / height;
        const targetRatio = CONFIG.SCREEN_RATIO;
        const difference = Math.abs(currentRatio - targetRatio);

        console.log(`当前窗口比例: ${currentRatio.toFixed(4)}, 目标比例: ${targetRatio.toFixed(4)}`);
        if (difference < 0.01) {
            console.log('✅ 窗口比例正确!');
        } else {
            console.warn(`❌ 窗口比例不正确，偏差: ${(difference * 100).toFixed(2)}%`);
        }
    }
}

// 导出单例
module.exports = new LayoutValidator();