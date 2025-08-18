/**
 * 模式管理模块
 * 负责处理调试模式和产品模式的切换
 */

// 配置参数
const MODE_CONFIG = {
    // 产品模式下的屏幕尺寸（单位：像素）
    SCREEN_WIDTH: 13570,  // 13.57米
    SCREEN_HEIGHT: 1800,  // 1.8米
    // 调试模式下的最大尺寸
    DEBUG_MAX_WIDTH: 1200,
    DEBUG_MAX_HEIGHT: 800
};

/**
 * 模式管理器类
 */
class ModeManager {
    constructor() {
        this.currentMode = 'debug'; // 默认调试模式
        this.isElectron = window && window.electronAPI;
        this.init();
    }

    /**
     * 初始化模式管理器
     */
    init() {
        // 添加模式切换按钮事件监听
        document.getElementById('debug-mode-btn').addEventListener('click', () => this.setMode('debug'));
        document.getElementById('product-mode-btn').addEventListener('click', () => this.setMode('product'));

        // 如果在Electron环境中，从主进程获取模式信息
        if (this.isElectron) {
            window.electronAPI.receiveModeInfo((info) => {
                this.currentMode = info.isDebugMode ? 'debug' : 'product';
                this.applyModeSettings();
                this.updateButtonStates();
            });
        } else {
            // 非Electron环境下的初始设置
            this.applyModeSettings();
        }
    }

    /**
     * 设置当前模式
     * @param {string} mode - 模式名称 ('debug' 或 'product')
     */
    setMode(mode) {
        if (mode !== 'debug' && mode !== 'product') {
            console.error('无效的模式:', mode);
            return;
        }

        this.currentMode = mode;
        this.applyModeSettings();
        this.updateButtonStates();

        // 如果在Electron环境中，通知主进程切换模式
        if (this.isElectron) {
            window.electronAPI.changeMode(mode === 'debug');
        }

        // 触发模式变更事件
        const event = new CustomEvent('modeChanged', { detail: { mode } });
        document.dispatchEvent(event);
    }

    /**
     * 更新模式按钮状态
     */
    updateButtonStates() {
        document.getElementById('debug-mode-btn').classList.toggle('active', this.currentMode === 'debug');
        document.getElementById('product-mode-btn').classList.toggle('active', this.currentMode === 'product');
    }

    /**
     * 应用当前模式的设置
     */
    applyModeSettings() {
        const appContainer = document.getElementById('app-container');
        const body = document.body;

        // 移除所有模式类
        body.classList.remove('debug-mode', 'product-mode');

        if (this.currentMode === 'debug') {
            // 应用调试模式设置
            body.classList.add('debug-mode');
            appContainer.style.width = '100%';
            appContainer.style.height = '100vh';
        } else {
            // 应用产品模式设置
            body.classList.add('product-mode');
            appContainer.style.width = `${MODE_CONFIG.SCREEN_WIDTH}px`;
            appContainer.style.height = `${MODE_CONFIG.SCREEN_HEIGHT}px`;

            // 计算缩放比例以适应屏幕
            this.scaleToFit();
        }
    }

    /**
     * 缩放应用以适应屏幕（产品模式下）
     */
    scaleToFit() {
        const appContainer = document.getElementById('app-container');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const scaleX = windowWidth / MODE_CONFIG.SCREEN_WIDTH;
        const scaleY = windowHeight / MODE_CONFIG.SCREEN_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        appContainer.style.transform = `scale(${scale}) translateX(-50%)`;
        appContainer.style.left = '50%';
    }
}

// 导出模式管理器实例
const modeManager = new ModeManager();
export default modeManager;