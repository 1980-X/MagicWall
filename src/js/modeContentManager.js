// 模式内容管理器 - 管理不同模式下各内容区的显示内容

class ModeContentManager {
    constructor() {
        this.currentMode = null;
        this.contentContainers = {};
        this.modeConfigs = this.initializeModeConfigs();
        this.gifElements = []; // 添加GIF元素管理数组
        
        // 绑定到全局对象
        window.modeContentManager = this;
        
        console.log('模式内容管理器已初始化');
    }
    
    // 初始化模式配置
    initializeModeConfigs() {
        return {
            'button-03': { // 安全生产委员会模式
                name: '安全生产委员会',
                zones: {
                    'zone-01': {
                        type: 'gif',
                        content: [{
                            src: './assets/Mode‌/aqscwyh/Zone_01/Page_1/Dynamic-01-1.gif',
                            alt: '安全生产委员会-内容区一-动态元素',
                            style: {
                                width: '39.2%', // 在原56%基础上缩小70%（相对于容器宽度的百分比，确保在不同屏幕尺寸下保持一致）
                                height: 'auto',
                                position: 'absolute',
                                top: '50%', // 相对于容器高度的百分比
                                left: '50%', // 相对于容器宽度的百分比
                                transform: 'translate(-50%, -50%)', // 居中对齐，不受屏幕尺寸影响
                                zIndex: 10
                            }
                        }]
                    },
                    'zone-02': {
                        type: 'images',
                        content: [{
                            src: './assets/Mode‌/aqscwyh/Zone_02/Page_1/Icon-02-2.png',
                            alt: '安全生产委员会-内容区二-图标2',
                            style: {
                                width: '17.5175%', // 在原15.925%基础上放大10%（15.925% × 1.1 = 17.5175%）
                                height: 'auto',
                                position: 'absolute',
                                top: '65%', // 在原90%基础上向上移动25%（90% - 25% = 65%）
                                left: '35%', // 调整位置避免重叠，左图在35%位置，保留小间距
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10
                            }
                        }, {
                            src: './assets/Mode‌/aqscwyh/Zone_02/Page_1/Icon-02-3.png',
                            alt: '安全生产委员会-内容区二-图标3',
                            style: {
                                width: '25.025%', // 在原22.75%基础上放大10%（22.75% × 1.1 = 25.025%）
                                height: 'auto',
                                position: 'absolute',
                                top: '65%', // 在原90%基础上向上移动25%（90% - 25% = 65%）
                                left: '65%', // 调整位置避免重叠，右图在65%位置，保留小间距
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10
                            }
                        }]
                    },
                    'zone-03': {
                        type: 'gif',
                        content: [{
                            src: './assets/Mode‌/aqscwyh/Zone_03/Page_1/Dynamic-01-1.gif',
                            alt: '安全生产委员会-内容区三-动态元素',
                            style: {
                                width: '39.2%', // 在原56%基础上缩小70%（相对于容器宽度的百分比，确保在不同屏幕尺寸下保持一致）
                                height: 'auto',
                                position: 'absolute',
                                top: '50%', // 相对于容器高度的百分比
                                left: '50%', // 相对于容器宽度的百分比
                                transform: 'translate(-50%, -50%)', // 居中对齐，不受屏幕尺寸影响
                                zIndex: 10
                            }
                        }]
                    },
                    'zone-04': {
                        type: 'gif',
                        content: [{
                            src: './assets/Mode‌/aqscwyh/Zone_04(甲方没提供内容)/Page_1/Dynamic-01-1.gif',
                            alt: '安全生产委员会-内容区四-动态元素',
                            style: {
                                width: '39.2%', // 在原56%基础上缩小70%（相对于容器宽度的百分比，确保在不同屏幕尺寸下保持一致）
                                height: 'auto',
                                position: 'absolute',
                                top: '50%', // 相对于容器高度的百分比
                                left: '50%', // 相对于容器宽度的百分比
                                transform: 'translate(-50%, -50%)', // 居中对齐，不受屏幕尺寸影响
                                zIndex: 10
                            }
                        }]
                    }
                }
            }
            // 其他模式配置将在后续添加
        };
    }
    
    // 初始化内容容器
    initializeContentContainers() {
        // 获取四个内容区容器
        this.contentContainers = {
            'zone-01': document.getElementById('section-2'),
            'zone-02': document.getElementById('section-3'),
            'zone-03': document.getElementById('section-4'),
            'zone-04': document.getElementById('section-5')
        };
        
        // 为每个容器创建模式内容容器
        Object.keys(this.contentContainers).forEach(zoneId => {
            const container = this.contentContainers[zoneId];
            if (container) {
                // 创建模式内容容器
                const modeContentContainer = document.createElement('div');
                modeContentContainer.id = `${zoneId}-mode-content`;
                modeContentContainer.className = 'mode-content-container';
                modeContentContainer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    pointer-events: none;
                `;
                
                container.appendChild(modeContentContainer);
                console.log(`已为 ${zoneId} 创建模式内容容器`);
            }
        });
    }
    
    // 切换模式内容
    switchModeContent(buttonId) {
        console.log(`切换到模式: ${buttonId}`);
        
        // 清空所有内容区
        this.clearAllModeContent();
        
        // 获取模式配置
        const modeConfig = this.modeConfigs[buttonId];
        if (!modeConfig) {
            console.warn(`未找到模式 ${buttonId} 的配置`);
            return;
        }
        
        // 更新当前模式
        this.currentMode = buttonId;
        
        // 为每个区域设置内容
        Object.keys(modeConfig.zones).forEach(zoneId => {
            const zoneConfig = modeConfig.zones[zoneId];
            this.setZoneContent(zoneId, zoneConfig);
        });
        
        console.log(`模式 ${buttonId} 内容已加载完成`);
    }
    
    // 设置区域内容
    setZoneContent(zoneId, zoneConfig) {
        const container = document.getElementById(`${zoneId}-mode-content`);
        if (!container) {
            console.error(`未找到 ${zoneId} 的模式内容容器`);
            return;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 添加内容元素
        zoneConfig.content.forEach((contentItem, index) => {
            const element = document.createElement('img');
            // 注意：对于GIF元素，src将在后面延迟设置
            if (zoneConfig.type !== 'gif') {
                element.src = contentItem.src;
            }
            element.alt = contentItem.alt;
            element.id = `${zoneId}-content-${index}`;
            
            // 应用样式
            Object.keys(contentItem.style).forEach(styleProp => {
                element.style[styleProp] = contentItem.style[styleProp];
            });
            
            // 如果是GIF元素，创建循环播放管理对象
            if (zoneConfig.type === 'gif') {
                const gifInfo = {
                    id: `${zoneId}-gif-${index}`,
                    element: element,
                    originalPath: contentItem.src,
                    zoneId: zoneId,
                    loadAttempts: 0,
                    maxLoadAttempts: 3,
                    isLoading: true, // 初始状态设为加载中
                    operationInProgress: true,
                    lastLoadTimestamp: 0,
                    currentLoadAttemptId: Date.now(),
                    isResetting: false,
                    resetInterval: null
                };
                
                // 添加到GIF管理数组
                this.gifElements.push(gifInfo);
                
                // 绑定GIF循环播放事件
                this.bindGifLoopEvents(gifInfo);
                
                // 延迟设置src，确保事件绑定完成
                setTimeout(() => {
                    element.src = contentItem.src;
                }, 50);
                
                console.log(`已为GIF ${gifInfo.id} 设置循环播放管理`);
            } else {
                // 非GIF元素的普通加载事件
                element.onload = () => {
                    console.log(`${zoneId} 内容已加载: ${contentItem.src}`);
                };
                
                element.onerror = (error) => {
                    console.error(`${zoneId} 内容加载失败: ${contentItem.src}`, error);
                };
            }
            
            container.appendChild(element);
        });
        
        console.log(`${zoneId} 内容已设置，共 ${zoneConfig.content.length} 个元素`);
    }
    
    // 清空所有模式内容
    clearAllModeContent() {
        // 清理所有GIF元素的定时器
        this.cleanupGifElements();
        
        Object.keys(this.contentContainers).forEach(zoneId => {
            const container = document.getElementById(`${zoneId}-mode-content`);
            if (container) {
                container.innerHTML = '';
            }
        });
        
        console.log('所有模式内容已清空');
    }
    
    // 绑定GIF循环播放事件
    bindGifLoopEvents(gifInfo) {
        if (!gifInfo || !gifInfo.element) return;
        
        gifInfo.element.onload = () => {
            console.log(`GIF动画 ${gifInfo.id} onload 事件触发, 当前状态:`, {
                isLoading: gifInfo.isLoading,
                operationInProgress: gifInfo.operationInProgress,
                isResetting: gifInfo.isResetting
            });
            
            // 对于初始加载，直接处理，不检查状态
            // 对于重置加载，需要检查状态
            if (!gifInfo.isResetting && !gifInfo.isLoading && !gifInfo.operationInProgress) {
                console.log(`GIF动画 ${gifInfo.id} 加载完成事件被忽略，状态已重置`);
                return;
            }
            
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.loadAttempts = 0;
            gifInfo.lastLoadTimestamp = Date.now();
            console.log(`GIF动画 ${gifInfo.id} 加载完成`);
            
            // 设置定期重置，确保动画持续循环播放
            if (!gifInfo.resetInterval) {
                // 为每个GIF设置不同的随机重置间隔（2-4秒），避免所有GIF在同一时间重置
                const randomInterval = 2000 + Math.random() * 2000; // 2-4秒随机间隔
                gifInfo.resetInterval = setInterval(() => {
                    this.resetGifAnimation(gifInfo);
                }, randomInterval);
                console.log(`GIF动画 ${gifInfo.id} 设置了 ${Math.round(randomInterval/1000)} 秒重置间隔`);
            }
        };
        
        gifInfo.element.onerror = (e) => {
            // 检查是否真的在加载中，避免处理过时的错误事件
            if (!gifInfo.isLoading && !gifInfo.operationInProgress) {
                console.log(`GIF动画 ${gifInfo.id} 错误事件被忽略，状态已重置`);
                return;
            }
            
            // 检查是否在短时间内已经成功加载过，避免处理滞后的错误事件
            if (gifInfo.lastLoadTimestamp > 0 && 
                (Date.now() - gifInfo.lastLoadTimestamp < 1000)) {
                console.log(`GIF动画 ${gifInfo.id} 错误事件被忽略，已在1秒内成功加载`);
                return;
            }
            
            // 如果是重置过程中的错误，不增加重试计数，直接视为重置的一部分
            if (gifInfo.isResetting) {
                console.log(`GIF动画 ${gifInfo.id} 重置过程中的错误被忽略，继续等待加载完成`);
                return;
            }
            
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.loadAttempts++;
            console.error(`加载GIF动画 ${gifInfo.id} 失败 (尝试 ${gifInfo.loadAttempts}/${gifInfo.maxLoadAttempts}):`, e);
            
            // 添加自动重试机制
            if (gifInfo.loadAttempts < gifInfo.maxLoadAttempts) {
                console.log(`将在2秒后尝试重新加载GIF动画 ${gifInfo.id}...`);
                setTimeout(() => {
                    this.retryLoadingGif(gifInfo);
                }, 2000);
            } else {
                console.error(`GIF动画 ${gifInfo.id} 已达到最大重试次数(${gifInfo.maxLoadAttempts})，加载失败`);
                // 10秒后尝试完全重新初始化GIF
                setTimeout(() => {
                    if (!gifInfo.isLoading && !gifInfo.operationInProgress) {
                        console.log(`尝试完全重新初始化GIF动画 ${gifInfo.id}...`);
                        this.reinitializeGifAnimation(gifInfo);
                    }
                }, 10000);
            }
        };
    }
    
    // 重置GIF动画以确保持续播放
    resetGifAnimation(gifInfo) {
        // 检查是否正在操作中
        if (!gifInfo || 
            !gifInfo.element || 
            gifInfo.isLoading || 
            gifInfo.operationInProgress) {
            console.log(`GIF ${gifInfo?.id || 'unknown'} 重置被跳过，当前状态不允许重置`);
            return;
        }
        
        try {
            console.log(`开始GIF ${gifInfo.id} 重置操作`);
            gifInfo.isLoading = true;
            gifInfo.operationInProgress = true;
            gifInfo.currentLoadAttemptId = Date.now();
            const currentId = gifInfo.currentLoadAttemptId;
            gifInfo.isResetting = true;
            
            // 创建一个新的Image对象用于预加载
            const tempImg = new Image();
            const cacheBuster = '?t=' + Date.now();
            
            tempImg.onload = () => {
                try {
                    if (currentId === gifInfo.currentLoadAttemptId) {
                        gifInfo.element.src = gifInfo.originalPath + cacheBuster;
                        gifInfo.isLoading = false;
                        gifInfo.operationInProgress = false;
                        gifInfo.isResetting = false;
                        gifInfo.lastLoadTimestamp = Date.now();
                        console.log(`GIF ${gifInfo.id} 重置操作成功完成`);
                    }
                } catch (err) {
                    gifInfo.isLoading = false;
                    gifInfo.operationInProgress = false;
                    gifInfo.isResetting = false;
                    console.error(`重置GIF动画 ${gifInfo.id} 时出错:`, err);
                }
            };
            
            tempImg.onerror = () => {
                gifInfo.isLoading = false;
                gifInfo.operationInProgress = false;
                gifInfo.isResetting = false;
                console.error(`GIF ${gifInfo.id} 重置操作失败，无法预加载新资源`);
                
                // 尝试使用备用方案
                try {
                    gifInfo.element.src = gifInfo.originalPath + '?t=' + Date.now();
                    console.log(`GIF ${gifInfo.id} 尝试备用重置方案`);
                } catch (err) {
                    console.error(`GIF ${gifInfo.id} 备用重置方案也失败:`, err);
                }
            };
            
            tempImg.src = gifInfo.originalPath + cacheBuster;
            
        } catch (err) {
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.isResetting = false;
            console.error(`执行GIF ${gifInfo.id} 重置操作时出错:`, err);
        }
    }
    
    // 重试加载GIF
    retryLoadingGif(gifInfo) {
        if (!gifInfo || !gifInfo.element) return;
        
        gifInfo.isLoading = true;
        gifInfo.operationInProgress = true;
        gifInfo.currentLoadAttemptId = Date.now();
        
        setTimeout(() => {
            if (gifInfo.currentLoadAttemptId === gifInfo.currentLoadAttemptId) {
                gifInfo.element.src = gifInfo.originalPath;
                console.log(`重试加载GIF动画 ${gifInfo.id}`);
            }
        }, 50);
    }
    
    // 完全重新初始化GIF动画
    reinitializeGifAnimation(gifInfo) {
        try {
            console.log(`开始完全重新初始化GIF动画 ${gifInfo.id}...`);
            
            if (gifInfo.isLoading || gifInfo.operationInProgress) {
                console.log(`重新初始化 ${gifInfo.id} 被推迟，当前有操作进行中`);
                setTimeout(() => {
                    this.reinitializeGifAnimation(gifInfo);
                }, 1000);
                return;
            }
            
            if (gifInfo.resetInterval) {
                clearInterval(gifInfo.resetInterval);
                gifInfo.resetInterval = null;
            }
            
            gifInfo.loadAttempts = 0;
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.isResetting = false;
            
            const parent = gifInfo.element.parentNode;
            if (parent) {
                parent.removeChild(gifInfo.element);
                
                const newGifElement = document.createElement('img');
                newGifElement.style.position = 'absolute';
                newGifElement.style.zIndex = '10';
                newGifElement.style.pointerEvents = 'none';
                newGifElement.setAttribute('alt', gifInfo.element.alt);
                
                // 复制原有样式
                const originalStyles = gifInfo.element.style;
                for (let i = 0; i < originalStyles.length; i++) {
                    const prop = originalStyles[i];
                    newGifElement.style[prop] = originalStyles[prop];
                }
                
                gifInfo.element = newGifElement;
                parent.appendChild(newGifElement);
                console.log(`GIF动画 ${gifInfo.id} 元素已重新创建并添加到容器`);
            }
            
            this.bindGifLoopEvents(gifInfo);
            
            setTimeout(() => {
                gifInfo.element.src = gifInfo.originalPath;
            }, 300);
        } catch (err) {
            console.error(`完全重新初始化GIF动画 ${gifInfo.id} 时出错:`, err);
        }
    }
    
    // 清理GIF元素资源
    cleanupGifElements() {
        this.gifElements.forEach(gifInfo => {
            if (gifInfo.resetInterval) {
                clearInterval(gifInfo.resetInterval);
                gifInfo.resetInterval = null;
            }
        });
        
        this.gifElements = [];
        console.log('所有GIF元素资源已清理');
    }
    
    // 获取当前模式
    getCurrentMode() {
        return this.currentMode;
    }
    
    // 添加新模式配置
    addModeConfig(buttonId, config) {
        this.modeConfigs[buttonId] = config;
        console.log(`已添加模式 ${buttonId} 的配置`);
    }
    
    // 更新区域内容配置
    updateZoneConfig(buttonId, zoneId, zoneConfig) {
        if (this.modeConfigs[buttonId]) {
            this.modeConfigs[buttonId].zones[zoneId] = zoneConfig;
            
            // 如果是当前模式，立即更新显示
            if (this.currentMode === buttonId) {
                this.setZoneContent(zoneId, zoneConfig);
            }
            
            console.log(`已更新模式 ${buttonId} 的 ${zoneId} 配置`);
        }
    }
}

// 创建全局实例
const modeContentManager = new ModeContentManager();

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保其他组件已就绪
    setTimeout(() => {
        modeContentManager.initializeContentContainers();
        
        // 监听模式切换事件
        document.addEventListener('modeChange', function(event) {
            const buttonId = event.detail.buttonId;
            modeContentManager.switchModeContent(buttonId);
        });
        
        console.log('模式内容管理器事件监听已设置');
    }, 200);
});