// 背景元素管理器
class BackgroundManager {
    constructor() {
        this.backgroundElements = [];
        this.isDebugMode = false;
        this.isInitialized = false;
    }

    // 初始化背景管理器
    init() {
        if (this.isInitialized) return;

        // 收集所有背景元素，但不包括Canvas背景
        this.backgroundElements = document.querySelectorAll(
            '.background-container > div:not(#canvas-background), .auxiliary-background, #dynamic-background-container > div'
        );

        // 检测当前模式
        this.detectMode();

        // 监听窗口尺寸变化，确保背景元素比例一致
        window.addEventListener('resize', this.handleResize.bind(this));

        this.isInitialized = true;
        console.log('背景管理器已初始化，共管理', this.backgroundElements.length, '个背景元素');
    }

    // 检测当前模式（调试模式或产品模式）
    detectMode() {
        // 通过URL参数或特定元素检测模式
        const urlParams = new URLSearchParams(window.location.search);
        const debugParam = urlParams.get('debug');
        
        if (debugParam === 'true') {
            this.isDebugMode = true;
            document.body.classList.add('debug-mode');
        } else {
            this.isDebugMode = false;
            document.body.classList.remove('debug-mode');
        }
    }

    // 处理窗口尺寸变化
    handleResize() {
        // 确保所有背景元素保持正确的比例和位置
        this.backgroundElements.forEach(element => {
            if (element.classList.contains('auxiliary-background')) {
                // 对于辅助背景元素，如果是img标签，设置object-fit属性
                if (element.tagName === 'IMG') {
                    element.style.objectFit = 'contain';
                    // 注意：transform和transform-origin已经通过CSS设置，这里不需要重复设置
                }
            }
        });
    }

    // 加载特定背景配置
    loadBackgroundConfig(config) {
        if (!config) return;

        // 应用配置到背景元素
        if (config.auxiliaryBackgrounds) {
            config.auxiliaryBackgrounds.forEach((bgConfig, index) => {
                const elementId = bgConfig.id || `background-elements-${String(index + 1).padStart(2, '0')}`;
                const element = document.getElementById(elementId);
                
                if (element) {
                    // 应用配置
                    if (bgConfig.opacity !== undefined) {
                        element.style.opacity = bgConfig.opacity;
                    }
                    if (bgConfig.zIndex !== undefined) {
                        element.style.zIndex = bgConfig.zIndex;
                    }
                    if (bgConfig.imageUrl) {
                        element.style.backgroundImage = `url('${bgConfig.imageUrl}')`;
                    }
                }
            });
        }
    }

    // 为布局验证系统提供背景元素的相对位置信息
    getBackgroundElementsInfo() {
        const elementsInfo = {};
        
        this.backgroundElements.forEach(element => {
            if (element.id) {
                const rect = element.getBoundingClientRect();
                elementsInfo[element.id] = {
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
                    relLeft: rect.left / window.innerWidth,
                    // 标记为背景元素
                    isBackground: true
                };
            }
        });
        
        return elementsInfo;
    }

    // 切换调试模式显示
    toggleDebugView(show) {
        const debugView = document.getElementById('background-debug-info');
        
        if (show) {
            if (!debugView) {
                // 创建调试信息面板
                const panel = document.createElement('div');
                panel.id = 'background-debug-info';
                panel.style.position = 'fixed';
                panel.style.top = '10px';
                panel.style.right = '10px';
                panel.style.background = 'rgba(0, 0, 0, 0.8)';
                panel.style.color = 'white';
                panel.style.padding = '10px';
                panel.style.borderRadius = '5px';
                panel.style.zIndex = '9999';
                panel.style.fontSize = '12px';
                panel.style.maxWidth = '300px';
                panel.style.overflow = 'auto';
                panel.innerText = this.generateDebugInfo();
                document.body.appendChild(panel);
            } else {
                debugView.innerText = this.generateDebugInfo();
            }
        } else if (debugView) {
            debugView.remove();
        }
    }

    // 生成调试信息
    generateDebugInfo() {
        const info = [
            `背景元素总数: ${this.backgroundElements.length}`,
            `当前模式: ${this.isDebugMode ? '调试' : '产品'}`,
            `窗口尺寸: ${window.innerWidth}x${window.innerHeight}`,
            `--screen-ratio: ${getComputedStyle(document.documentElement).getPropertyValue('--screen-ratio')}`,
            '',
            '背景元素列表:'
        ];
        
        this.backgroundElements.forEach((element, index) => {
            if (element.id) {
                info.push(`- ${element.id}: ${element.classList}`);
            } else {
                info.push(`- [未命名元素${index + 1}]: ${element.classList}`);
            }
        });
        
        return info.join('\n');
    }
}

// 创建单例实例
const backgroundManager = new BackgroundManager();

// 将功能暴露到全局作用域
window.BackgroundManager = BackgroundManager;
window.backgroundManager = backgroundManager;
window.initBackgroundManager = function() {
    // 初始化背景管理器
    try {
        backgroundManager.init();
    } catch (error) {
        console.error('初始化背景管理器时出错:', error);
    }
};

// 在DOM加载完成后初始化背景管理器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initBackgroundManager);
} else {
    window.initBackgroundManager();
}