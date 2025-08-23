// 使用Canvas来渲染和控制背景元素
class CanvasBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.backgroundImages = [];
        this.isInitialized = false;
        // 使用数组来存储多个GIF元素及其状态
        this.gifElements = [];
        this.gifResetIntervals = [];
    }

    // 初始化Canvas背景
    init() {
        if (this.isInitialized) return;

        // 创建Canvas元素
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas-background';
        this.canvas.style.position = 'absolute';
        this.canvas.style.bottom = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none'; // 使Canvas不干扰鼠标事件
        
        // 将Canvas添加到动态背景容器中
        const dynamicContainer = document.getElementById('dynamic-background-container');
        if (dynamicContainer) {
            dynamicContainer.appendChild(this.canvas);
            console.log('Canvas已成功添加到动态背景容器');
        } else {
            // 如果没有找到动态背景容器，回退到主背景容器
            const backgroundContainer = document.querySelector('.background-container');
            if (backgroundContainer) {
                backgroundContainer.appendChild(this.canvas);
                console.log('Canvas已成功添加到主背景容器');
            } else {
                console.error('未找到背景容器，Canvas无法添加到页面');
                return;
            }
        }

        this.ctx = this.canvas.getContext('2d');
        
        // 加载背景图片
        this.loadBackgroundImages();
        
        // 监听窗口大小变化
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        
        // 初始调整Canvas大小
        this.resizeCanvas();
        
        // 开始渲染循环
        this.startRenderLoop();
        
        this.isInitialized = true;
        console.log('Canvas背景已初始化');
    }

    // 加载背景图片
    loadBackgroundImages() {
        // 创建图片对象
        const img02 = new Image();
        const img03 = new Image();
        
        // 设置图片源
        img02.src = './assets/images/OverallBackground/Backgroundelements02.png';
        img03.src = './assets/images/OverallBackground/Backgroundelements03.png';
        
        // 存储图片信息 - 缩放比例设置为22.5%以满足用户需求（在25%的基础上再缩小10%）
        this.backgroundImages = [
            { 
                image: img02, 
                scale: 0.225, 
                x: 1.1, // 初始X位置 - 更靠近屏幕的右侧边缘，让图片立即开始进入
                y: 1, // 始终贴着底部
                anchorX: 0.5, 
                anchorY: 1,
                // 动画相关属性
                speed: 0.0009 + Math.random() * 0.0018, // 移动速度降低10%
                direction: -1, // 固定从右到左移动
                width: 0 // 将在图片加载后设置实际宽度
            },
            {
                image: img03,
                scale: 0.225,
                x: -0.1, // 初始X位置 - 更靠近屏幕的左侧边缘，让图片立即开始进入
                y: 1, // 始终贴着底部
                anchorX: 0.5,
                anchorY: 1,
                // 动画相关属性
                speed: 0.0009 + Math.random() * 0.0018, // 移动速度降低10%
                direction: 1, // 固定从左到右移动
                width: 0 // 将在图片加载后设置实际宽度
            }
        ];
        
        // 为每个图片设置onload事件，但不等待所有图片加载完成
        this.backgroundImages.forEach(imgInfo => {
            imgInfo.image.onload = () => {
                console.log('背景图片已加载完成');
            };
            
            imgInfo.image.onerror = (e) => {
                console.error('加载背景图片失败:', e);
            };
        });
        
        // 单独处理GIF动画 - 使用img标签而非Canvas绘制以支持动画播放
        this.setupGifAnimation();
    }
    
    // 设置GIF动画元素 - 支持多个GIF元素
    setupGifAnimation() {
        // 清空现有的GIF元素和定时器
        this.cleanupGifElements();
        
        // 创建两个GIF动画元素配置
        const gifConfigs = [
            {
                id: 'gif-01',
                path: './assets/images/OverallBackground/BackgroundDynamics (Elements)/Dynamic-(element)01.gif',
                params: {
                    scale: 0.05625, // 等比例缩小75%，保留25%的大小（0.225 × 0.25）
                    x: -0.0094325, // 初始X位置 - 向左移动100%（相对于原来的位置）
                    y: 1, // 始终贴着底部
                    anchorX: 0, // 左对齐
                    anchorY: 1 // 下对齐
                }
            },
            {
                id: 'gif-02',
                path: './assets/images/OverallBackground/BackgroundDynamics (Elements)/Dynamic-(element)02.gif',
                params: {
                    scale: 0.05625, // 与第一个GIF相同的缩放比例
                    x: 0.2, // 初始X位置 - 在第一个GIF的右侧
                    y: 1, // 始终贴着底部
                    anchorX: 0, // 左对齐
                    anchorY: 1 // 下对齐
                }
            }
        ];
        
        // 添加到动态背景容器
        const dynamicContainer = document.getElementById('dynamic-background-container') || 
                               document.querySelector('.background-container');
        
        if (!dynamicContainer) {
            console.error('未找到背景容器，GIF动画元素无法添加到页面');
            return;
        }
        
        // 创建并初始化每个GIF元素
        gifConfigs.forEach((config, index) => {
            const gifInfo = {
                id: config.id,
                element: document.createElement('img'),
                originalPath: config.path,
                params: config.params,
                loadAttempts: 0,
                maxLoadAttempts: 3,
                isLoading: false,
                operationInProgress: false,
                lastLoadTimestamp: 0,
                currentLoadAttemptId: 0,
                isResetting: false,
                resetInterval: null
            };
            
            // 设置元素样式
            gifInfo.element.style.position = 'absolute';
            gifInfo.element.style.zIndex = '1'; // 确保在Canvas之上
            gifInfo.element.style.pointerEvents = 'none'; // 不干扰鼠标事件
            
            // 添加alt属性提高可访问性
            gifInfo.element.setAttribute('alt', `Dynamic background animation ${config.id}`);
            
            // 添加到容器
            dynamicContainer.appendChild(gifInfo.element);
            console.log(`GIF动画元素 ${config.id} 已成功添加到背景容器`);
            
            // 将GIF信息添加到数组
            this.gifElements.push(gifInfo);
            
            // 设置事件处理
            this.bindGifEvents(gifInfo);
            
            // 开始加载
            this.startGifLoading(gifInfo);
        });
    }
    
    // 开始加载指定的GIF元素
    startGifLoading(gifInfo) {
        gifInfo.isLoading = true;
        gifInfo.operationInProgress = true;
        gifInfo.currentLoadAttemptId = Date.now(); // 为当前加载尝试生成唯一ID
        const currentId = gifInfo.currentLoadAttemptId;
        
        // 添加延迟以确保状态完全设置
        setTimeout(() => {
            // 确保这是最新的加载尝试
            if (currentId === gifInfo.currentLoadAttemptId) {
                gifInfo.element.src = gifInfo.originalPath;
                console.log('GIF动画开始加载，ID:', currentId);
            }
        }, 50);
        
        // 检查是否已经加载完成（可能是缓存命中）
        if (gifInfo.element.complete) {
            // 如果已经加载完成，手动触发onload回调
            setTimeout(() => {
                if (gifInfo.element && gifInfo.element.complete && gifInfo.isLoading) {
                    gifInfo.isLoading = false;
                    gifInfo.operationInProgress = false;
                    gifInfo.loadAttempts = 0;
                    gifInfo.lastLoadTimestamp = Date.now();
                    console.log('GIF动画已从缓存加载完成');
                    this.updateGifPosition(gifInfo);
                }
            }, 100);
        }
    }
    
    // 重置GIF动画以确保持续播放
    resetGifAnimation(gifInfo) {
        // 检查是否正在操作中，或在短时间内已经加载过
        if (!gifInfo || 
            !gifInfo.element || 
            gifInfo.isLoading || 
            gifInfo.operationInProgress || 
            (Date.now() - gifInfo.lastLoadTimestamp < 10000)) { // 至少10秒后才能重置
            console.log(`GIF ${gifInfo?.id || 'unknown'} 重置被跳过，当前状态不允许重置`);
            return;
        }
        
        try {
            console.log(`开始GIF ${gifInfo.id} 重置操作`);
            gifInfo.isLoading = true;
            gifInfo.operationInProgress = true;
            gifInfo.currentLoadAttemptId = Date.now(); // 更新加载尝试ID
            gifInfo.isResetting = true;
            
            // 创建一个新的Image对象用于预加载
            const tempImg = new Image();
            
            // 添加缓存清理参数
            const cacheBuster = '?t=' + Date.now();
            
            // 设置onload事件处理器
            tempImg.onload = () => {
                try {
                    // 确保这是最新的加载尝试
                    if (gifInfo.currentLoadAttemptId === gifInfo.currentLoadAttemptId) {
                        // 预加载成功后，更新实际GIF元素的src
                        gifInfo.element.src = gifInfo.originalPath + cacheBuster;
                        
                        // 重置状态
                        gifInfo.isLoading = false;
                        gifInfo.operationInProgress = false;
                        gifInfo.isResetting = false;
                        gifInfo.lastLoadTimestamp = Date.now();
                        console.log(`GIF ${gifInfo.id} 重置操作成功完成`);
                        
                        // 确保位置正确
                        setTimeout(() => {
                            this.updateGifPosition(gifInfo);
                        }, 100);
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
                
                // 尝试使用备用方案 - 直接重置现有元素
                try {
                    // 添加随机参数以避免缓存
                    gifInfo.element.src = gifInfo.originalPath + '?t=' + Date.now();
                    console.log(`GIF ${gifInfo.id} 尝试备用重置方案`);
                } catch (err) {
                    console.error(`GIF ${gifInfo.id} 备用重置方案也失败:`, err);
                }
            };
            
            // 开始预加载
            tempImg.src = gifInfo.originalPath + cacheBuster;
            
            // 设置超时保护
            setTimeout(() => {
                if (gifInfo.isResetting) {
                    console.log(`GIF ${gifInfo.id} 重置操作超时，将恢复状态`);
                    gifInfo.isLoading = false;
                    gifInfo.operationInProgress = false;
                    gifInfo.isResetting = false;
                }
            }, 5000); // 5秒超时
        } catch (err) {
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.isResetting = false;
            console.error(`执行GIF ${gifInfo.id} 重置操作时出错:`, err);
        }
    }
    
    // 绑定GIF元素的事件处理器
    bindGifEvents(gifInfo) {
        if (!gifInfo || !gifInfo.element) return;
        
        // 移除旧的事件绑定，防止多次绑定
        gifInfo.element.onload = () => {
            // 检查是否真的在加载中，避免处理过时的事件
            if (!gifInfo.isLoading && !gifInfo.operationInProgress) {
                console.log(`GIF动画 ${gifInfo.id} 加载完成事件被忽略，状态已重置`);
                return;
            }
            
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.loadAttempts = 0;
            gifInfo.lastLoadTimestamp = Date.now();
            console.log(`GIF动画 ${gifInfo.id} 加载完成`);
            
            // 加载完成后更新位置
            this.updateGifPosition(gifInfo);
            
            // 设置定期重置，确保动画持续循环播放
            if (!gifInfo.resetInterval) {
                gifInfo.resetInterval = setInterval(() => {
                    this.resetGifAnimation(gifInfo);
                }, 10000); // 每10秒重置一次
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
                }, 2000); // 进一步增加重试间隔到2秒
            } else {
                console.error(`GIF动画 ${gifInfo.id} 已达到最大重试次数(${gifInfo.maxLoadAttempts})，加载失败`);
                // 10秒后尝试完全重新初始化GIF，给系统更多恢复时间
                setTimeout(() => {
                    // 确保当前没有正在进行的操作
                    if (!gifInfo.isLoading && !gifInfo.operationInProgress) {
                        console.log(`尝试完全重新初始化GIF动画 ${gifInfo.id}...`);
                        this.reinitializeGifAnimation(gifInfo);
                    } else {
                        console.log(`重新初始化GIF动画 ${gifInfo.id} 被跳过，当前有操作进行中`);
                        // 1秒后再次尝试
                        setTimeout(() => {
                            this.reinitializeGifAnimation(gifInfo);
                        }, 1000);
                    }
                }, 10000);
            }
        };
    }
    
    // 完全重新初始化单个GIF动画
    reinitializeGifAnimation(gifInfo) {
        try {
            console.log(`开始完全重新初始化GIF动画 ${gifInfo.id}...`);
            
            // 确保当前没有正在进行的操作
            if (gifInfo.isLoading || gifInfo.operationInProgress) {
                console.log(`重新初始化 ${gifInfo.id} 被推迟，当前有操作进行中`);
                setTimeout(() => {
                    this.reinitializeGifAnimation(gifInfo);
                }, 1000);
                return;
            }
            
            // 清除所有相关资源
            if (gifInfo.resetInterval) {
                clearInterval(gifInfo.resetInterval);
                gifInfo.resetInterval = null;
            }
            
            // 重置状态
            gifInfo.loadAttempts = 0;
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.isResetting = false;
            
            // 从DOM中移除并重新添加元素，以确保完全重置
            const parent = gifInfo.element.parentNode;
            if (parent) {
                parent.removeChild(gifInfo.element);
                
                // 创建新元素
                const newGifElement = document.createElement('img');
                newGifElement.style.position = 'absolute';
                newGifElement.style.zIndex = '1';
                newGifElement.style.pointerEvents = 'none';
                newGifElement.setAttribute('alt', `Dynamic background animation ${gifInfo.id}`);
                
                // 更新引用
                gifInfo.element = newGifElement;
                
                // 重新添加到容器
                parent.appendChild(newGifElement);
                console.log(`GIF动画 ${gifInfo.id} 元素已重新创建并添加到容器`);
            }
            
            // 重新绑定事件
            this.bindGifEvents(gifInfo);
            
            // 延迟启动加载，给DOM时间更新
            setTimeout(() => {
                this.startGifLoading(gifInfo);
            }, 300);
        } catch (err) {
            console.error(`完全重新初始化GIF动画 ${gifInfo.id} 时出错:`, err);
        }
    }
    
    // 清理单个GIF元素的资源
    cleanupGifElements() {
        // 清除所有GIF元素
        this.gifElements.forEach(gifInfo => {
            // 清除重置定时器
            if (gifInfo.resetInterval) {
                clearInterval(gifInfo.resetInterval);
                gifInfo.resetInterval = null;
            }
            
            // 从DOM中移除元素
            if (gifInfo.element && gifInfo.element.parentNode) {
                gifInfo.element.parentNode.removeChild(gifInfo.element);
            }
        });
        
        // 清空数组
        this.gifElements = [];
    };

    
    // 清理资源，避免内存泄漏
    cleanup() {
        // 清理所有GIF元素
        this.cleanupGifElements();
        
        console.log('CanvasBackground资源已清理');
    };

    
    // 更新单个GIF动画的位置和大小
    updateGifPosition(gifInfo) {
        if (!gifInfo || !gifInfo.element || !gifInfo.params) return;
        
        // 获取容器尺寸
        const container = document.querySelector('.background-container');
        let containerWidth = window.innerWidth;
        let containerHeight = window.innerHeight;
        
        if (container) {
            const rect = container.getBoundingClientRect();
            containerWidth = rect.width;
            containerHeight = rect.height;
        }
        
        // 计算GIF的缩放尺寸
        const scaledWidth = containerWidth * gifInfo.params.scale;
        const scaledHeight = scaledWidth; // 假设GIF是正方形
        
        // 设置GIF元素的样式
        gifInfo.element.style.width = scaledWidth + 'px';
        gifInfo.element.style.height = scaledHeight + 'px';
        
        // 计算位置 - 基于容器的百分比位置，考虑锚点
        const x = containerWidth * gifInfo.params.x - scaledWidth * gifInfo.params.anchorX;
        const y = containerHeight * (1 - gifInfo.params.y) - scaledHeight * (1 - gifInfo.params.anchorY);
        
        gifInfo.element.style.left = x + 'px';
        gifInfo.element.style.bottom = y + 'px';
        
        console.log(`GIF动画 ${gifInfo.id} 位置已更新 - 容器尺寸: ${containerWidth}x${containerHeight}, GIF尺寸: ${scaledWidth}x${scaledHeight}, 位置: (${x}, ${y})`);
    }

    // 调整Canvas大小以匹配窗口
    resizeCanvas() {
        const container = document.querySelector('.background-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            
            console.log('Canvas已调整大小:', rect.width, 'x', rect.height);
        } else {
            // 如果没有找到容器，使用窗口尺寸
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
        }
        
        // 调整大小后重新渲染
        this.render();
        
        // 更新所有GIF动画的位置
        this.gifElements.forEach(gifInfo => {
            this.updateGifPosition(gifInfo);
        });
    };


    // 渲染背景元素
    render() {
        if (!this.ctx) return;
        
        // 清空Canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染每个背景元素 - 立即渲染，不等待图片完全加载完成
        this.backgroundImages.forEach(imgInfo => {
            const img = imgInfo.image;
            const scale = imgInfo.scale;
            const x = this.canvas.width * imgInfo.x;
            const y = this.canvas.height * imgInfo.y;
            
            // 图片尚未加载完成时，我们仍然继续位置更新
            // 这样当图片最终加载完成时，就已经处于正确的动画位置
            
            // 只有当图片有宽度信息时才进行绘制（确保图片已经开始加载）
            if (img.complete && img.naturalWidth > 0) {
                // 首次加载完成时设置宽度信息
                if (imgInfo.width === 0) {
                    imgInfo.width = img.naturalWidth * scale;
                }
                
                // 绘制图片，考虑锚点
                const drawX = x - img.naturalWidth * scale * imgInfo.anchorX;
                const drawY = y - img.naturalHeight * scale * imgInfo.anchorY;
                
                this.ctx.drawImage(img, drawX, drawY, img.naturalWidth * scale, img.naturalHeight * scale);
            }
        });
    }

    // 更新动画状态
    updateAnimation() {
        if (this.backgroundImages.length === 0) return;
        
        const canvasWidth = this.canvas ? this.canvas.width : window.innerWidth;
        
        // 更新每个背景元素的位置 - 立即开始动画，不等待图片加载完成
        this.backgroundImages.forEach(imgInfo => {
            if (imgInfo.direction === -1) {
                // 从右到左移动 (Backgroundelements02.png)
                imgInfo.x -= imgInfo.speed;
                
                // 如果图片已加载完成，进行边界检查和重置
                if (imgInfo.width > 0) {
                    // 检查是否完全移出左侧屏幕
                    // 计算图片完全离开屏幕需要的位置（考虑图片宽度）
                    const leftEdge = -0.1 - (imgInfo.width / canvasWidth) / 2;
                    if (imgInfo.x < leftEdge) {
                        // 重置到右侧屏幕外，准备重新进入
                        imgInfo.x = 1.1 + (imgInfo.width / canvasWidth) / 2; // 使用更靠近屏幕的位置
                        // 随机调整速度，使移动更自然
                        imgInfo.speed = 0.0009 + Math.random() * 0.0018; // 移动速度降低10%
                    }
                } else {
                    // 图片尚未加载完成，但继续移动位置，确保加载后能立即显示在正确位置
                    // 为防止位置溢出，这里设置一个简单的边界检查
                    if (imgInfo.x < -0.5) {
                        imgInfo.x = 1.1; // 使用更靠近屏幕的位置
                    }
                }
            } else if (imgInfo.direction === 1) {
                // 从左到右移动 (Backgroundelements03.png)
                imgInfo.x += imgInfo.speed;
                
                // 如果图片已加载完成，进行边界检查和重置
                if (imgInfo.width > 0) {
                    // 检查是否完全移出右侧屏幕
                    // 计算图片完全离开屏幕需要的位置（考虑图片宽度）
                    const rightEdge = 1 + (imgInfo.width / canvasWidth) / 2;
                    if (imgInfo.x > rightEdge) {
                        // 重置到左侧屏幕外，准备重新进入
                        imgInfo.x = -0.1 - (imgInfo.width / canvasWidth) / 2; // 使用更靠近屏幕的位置
                        // 随机调整速度，使移动更自然
                        imgInfo.speed = 0.0009 + Math.random() * 0.0018; // 移动速度降低10%
                    }
                } else {
                    // 图片尚未加载完成，但继续移动位置，确保加载后能立即显示在正确位置
                    // 为防止位置溢出，这里设置一个简单的边界检查
                    if (imgInfo.x > 1.5) {
                        imgInfo.x = -0.1; // 使用更靠近屏幕的位置
                    }
                }
            }
        });
    }
    
    // 开始渲染循环
    startRenderLoop() {
        // 使用requestAnimationFrame来创建渲染循环
        const renderLoop = () => {
            this.updateAnimation();
            this.render();
            requestAnimationFrame(renderLoop);
        };
        
        renderLoop();
    }
    
    // 将功能暴露到全局作用域
    static exposeToGlobal() {
        window.CanvasBackground = CanvasBackground;
    }

    // 初始化Canvas背景
    static initCanvasBackground() {
        // 创建单例实例
        const canvasBackground = new CanvasBackground();
        window.canvasBackground = canvasBackground;

        try {
            canvasBackground.init();
        } catch (error) {
            console.error('初始化Canvas背景时出错:', error);
        }
    }

    // 重置GIF动画
    resetGifAnimation(gifInfo) {
        if (!gifInfo || 
            !gifInfo.element || 
            gifInfo.isLoading || 
            gifInfo.operationInProgress || 
            (Date.now() - gifInfo.lastLoadTimestamp < 10000)) { // 至少10秒后才能重置
            console.log(`GIF ${gifInfo?.id || 'unknown'} 重置被跳过，当前状态不允许重置`);
            return;
        }
        
        try {
            console.log(`开始GIF ${gifInfo.id} 重置操作`);
            gifInfo.isLoading = true;
            gifInfo.operationInProgress = true;
            gifInfo.currentLoadAttemptId = Date.now(); // 更新加载尝试ID
            gifInfo.isResetting = true; // 标记为重置操作
            const currentId = gifInfo.currentLoadAttemptId;
            
            // 使用原始路径而非当前src，确保重置的一致性
            const cacheBuster = '?t=' + new Date().getTime();
            
            // 先设置为空字符串，然后短暂延迟后重新设置带时间戳的URL
            // 为了避免触发错误事件，我们可以使用一种更安全的重置方式
            // 创建一个新的Image对象来预加载新的GIF，然后再替换现有元素
            const tempImg = new Image();
            tempImg.onload = () => {
                try {
                    // 确保这是最新的加载尝试
                    if (currentId === gifInfo.currentLoadAttemptId) {
                        // 在更新src之前保存当前的display样式
                        const currentDisplay = gifInfo.element.style.display;
                        
                        // 先隐藏元素
                        gifInfo.element.style.display = 'none';
                        
                        // 更新src
                        gifInfo.element.src = gifInfo.originalPath + cacheBuster;
                        
                        // 短暂延迟后显示元素
                        setTimeout(() => {
                            gifInfo.element.style.display = currentDisplay;
                            console.log(`GIF动画 ${gifInfo.id} 已重置，尝试重新播放，ID:`, currentId);
                        }, 50);
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
                console.error(`预加载重置GIF ${gifInfo.id} 失败，将使用备用重置方法`);
                
                // 备用重置方法：直接修改src
                setTimeout(() => {
                    try {
                        if (currentId === gifInfo.currentLoadAttemptId) {
                            gifInfo.element.src = gifInfo.originalPath + cacheBuster;
                            console.log(`备用重置方法已使用 (${gifInfo.id})`);
                        }
                    } catch (err) {
                        console.error('备用重置方法也失败:', err);
                    }
                }, 100);
            };
            
            // 设置tempImg的src以开始预加载
            tempImg.src = gifInfo.originalPath + cacheBuster;
            
            // 设置超时，以防预加载过程卡住
            setTimeout(() => {
                if (gifInfo.isResetting) {
                    console.log(`GIF ${gifInfo.id} 重置操作超时，将恢复状态`);
                    gifInfo.isLoading = false;
                    gifInfo.operationInProgress = false;
                    gifInfo.isResetting = false;
                }
            }, 5000); // 5秒超时
        } catch (err) {
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.isResetting = false;
            console.error(`执行GIF ${gifInfo.id} 重置操作时出错:`, err);
        }
    }

    // 重试加载极GIF动画
    retryLoadingGif(gifInfo) {
        if (!gifInfo || !gifInfo.element || gifInfo.isLoading || gifInfo.operationInProgress) {
            console.log(`GIF ${gifInfo?.id || 'unknown'} 重试被跳过，当前状态不允许重试`);
            return;
        }
        
        try {
            console.log(`准备尝试重新加载GIF动画 ${gifInfo.id} (尝试 ${gifInfo.loadAttempts}/${gifInfo.maxLoadAttempts})...`);
            gifInfo.isLoading = true;
            gifInfo.operationInProgress = true;
            gifInfo.currentLoadAttemptId = Date.now(); // 更新加载尝试ID
            const currentId = gifInfo.currentLoadAttemptId;
            const cacheBuster = '?t=' + new Date().getTime();
            
            // 创建新的Image元素进行预加载，避免直接操作DOM元素
            const tempImg = new Image();
            tempImg.onload = () => {
                try {
                    // 确保这是最新的加载尝试
                    if (currentId === gifInfo.currentLoadAttemptId) {
                        // 预加载成功后，创建新的GIF元素替换旧元素
                        const newGifElement = gifInfo.element.cloneNode(false);
                        
                        // 先保存当前的样式和属性
                        const currentStyle = gifInfo.element.style.cssText;
                        
                        // 设置新的src
                        newGifElement.src = gifInfo.originalPath + cacheBuster;
                        
                        // 应用之前的样式
                        newGifElement.style.cssText = currentStyle;
                        
                        // 更新引用
                        if (gifInfo.element.parentNode) {
                            gifInfo.element.parentNode.replaceChild(newGifElement, gifInfo.element);
                            gifInfo.element = newGifElement;
                            
                            // 重新绑定事件处理器
                            this.bindGifEvents(gifInfo);
                        }
                        
                        console.log(`GIF动画 ${gifInfo.id} 重试加载已启动，ID: ${currentId} (尝试 ${gifInfo.loadAttempts}/${gifInfo.maxLoadAttempts})`);
                    } else {
                        console.log(`GIF动画 ${gifInfo.id} 重试加载已取消，有新的加载尝试，当前ID: ${currentId}`);
                        gifInfo.isLoading = false;
                        gifInfo.operationInProgress = false;
                    }
                } catch (err) {
                    gifInfo.isLoading = false;
                    gifInfo.operationInProgress = false;
                    console.error(`重试加载GIF动画 ${gifInfo.id} 时出错:`, err);
                }
            };
            
            tempImg.onerror = () => {
                gifInfo.isLoading = false;
                gifInfo.operationInProgress = false;
                console.error(`预加载GIF ${gifInfo.id} 失败 (尝试 ${gifInfo.loadAttempts}/${gifInfo.maxLoadAttempts})，将使用备用方法`);
                
                // 备用方法：使用传统的retry方式
                setTimeout(() => {
                    try {
                        if (currentId === gifInfo.currentLoadAttemptId) {
                            gifInfo.element.src = '';
                            
                            // 短暂延迟后重新设置事件处理器和带时间戳的URL
                            setTimeout(() => {
                                try {
                                    this.bindGifEvents(gifInfo);
                                    gifInfo.element.src = gifInfo.originalPath + cacheBuster;
                                } catch (err) {
                                    console.error('备用方法也失败:', err);
                                }
                            }, 300);
                        }
                    } catch (err) {
                        console.error('执行备用重试方法时出错:', err);
                    }
                }, 300);
            };
            
            // 设置tempImg的src以开始预加载
            tempImg.src = gifInfo.originalPath + cacheBuster;
            
            // 设置超时，以防预加载过程卡住
            setTimeout(() => {
                if (gifInfo.isLoading) {
                    console.log(`GIF ${gifInfo.id} 重试加载操作超时，将恢复状态`);
                    gifInfo.isLoading = false;
                    gifInfo.operationInProgress = false;
                }
            }, 5000); // 5秒超时
        } catch (err) {
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            console.error(`重试加载GIF动画 ${gifInfo.id} 时出错:`, err);
        }
    }
    
    // 绑定GIF元素的事件处理器
    bindGifEvents(gifInfo) {
        if (!gifInfo || !gifInfo.element) return;
        
        // 移除旧的事件绑定，防止多次绑定
        gifInfo.element.onload = () => {
            // 检查是否真的在加载中，避免处理过时的事件
            if (!gifInfo.isLoading && !gifInfo.operationInProgress) {
                console.log(`GIF动画 ${gifInfo.id} 加载完成事件被忽略，状态已重置`);
                return;
            }
            
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.isResetting = false; // 重置完成
            gifInfo.loadAttempts = 0; // 重置重试计数
            gifInfo.lastLoadTimestamp = Date.now();
            console.log(`GIF动画 ${gifInfo.id} 已加载完成，开始播放`);
            this.updateGifPosition(gifInfo);
            
            // 设置定时器，每隔一定时间重置GIF以确保无限循环
            if (!gifInfo.resetInterval) {
                gifInfo.resetInterval = setInterval(() => {
                    // 确保只有当加载成功且没有正在进行的操作时才重置
                    if (!gifInfo.isLoading && !gifInfo.operationInProgress && 
                        (Date.now() - gifInfo.lastLoadTimestamp > 3000)) { // 确保至少成功播放3秒
                        this.resetGifAnimation(gifInfo);
                    } else {
                        console.log(`GIF ${gifInfo.id} 重置被跳过，条件不满足`);
                    }
                }, 20000); // 每20秒重置一次
                console.log(`GIF ${gifInfo.id} 重置定时器已启动，每20秒重置一次`);
            }
        };
        
        gifInfo.element.onerror = (e) => {
            // 检查当前是否真的在加载中，避免处理过时的错误事件
            if (!gifInfo.isLoading && !gifInfo.operationInProgress) {
                console.log(`GIF动画 ${gifInfo.id} 错误事件被忽略，状态已重置`);
                return;
            }
            
            // 检查是否在短时间内已经成功加载过
            if (gifInfo.lastLoadTimestamp > 0 && 
                (Date.now() - gifInfo.lastLoadTimestamp < 1000)) {
                console.log(`GIF动画 ${gifInfo.id} 错误事件被忽略，已在1秒内成功加载`);
                return;
            }
            
            // 如果是重置过程中的错误，不增加重试计数，直接视为重置的一部分
            if (gifInfo.isResetting) {
                console.log(`GIF动画 ${gifInfo.id} 重置过程中的错误被忽略，继续等待加载完成`);
                gifInfo.isResetting = false;
                return;
            }
            
            gifInfo.isLoading = false;
            gifInfo.operationInProgress = false;
            gifInfo.loadAttempts++;
            console.error(`加载GIF动画 ${gifInfo.id} 失败 (尝试 ${gifInfo.loadAttempts}/${gifInfo.maxLoadAttempts}):`, e);
            
            if (gifInfo.loadAttempts < gifInfo.maxLoadAttempts) {
                console.log(`将在2秒后尝试重新加载GIF动画 ${gifInfo.id}...`);
                setTimeout(() => {
                    this.retryLoadingGif(gifInfo);
                }, 2000); // 增加重试间隔到2秒
            } else {
                console.error(`已达到最大重试次数(${gifInfo.maxLoadAttempts})，GIF动画 ${gifInfo.id} 加载失败`);
                setTimeout(() => {
                    if (!gifInfo.isLoading && !gifInfo.operationInProgress) {
                        console.log(`尝试完全重新初始化GIF动画 ${gifInfo.id}...`);
                        this.reinitializeGifAnimation(gifInfo);
                    }
                }, 10000); // 增加等待时间到10秒
            }
        };
    }
    
    // 完全重新初始化单个GIF动画
    reinitializeGifAnimation(gifInfo) {
        try {
            console.log(`开始完全重新初始化GIF动画 ${gifInfo.id}...`);
            
            // 确保当前没有正在进行的操作
            if (gifInfo.isLoading || gifInfo.operationInProgress) {
                console.log(`重新初始化 ${gifInfo.id} 被推迟，当前有操作进行中`);
                setTimeout(() => {
                    this.reinitializeGifAnimation(gifInfo);
                }, 1000);
                return;
            }
            
            // 清除所有相关资源
            if (gifInfo.resetInterval) {
                clearInterval(gifInfo.resetInterval);
                gifInfo.resetInterval = null;
            }
            
            if (gifInfo.element && gifInfo.element.parentNode) {
                gifInfo.element.onload = null;
                gifInfo.element.onerror = null;
                gifInfo.element.parentNode.removeChild(gifInfo.element);
                gifInfo.element = null;
                console.log(`GIF ${gifInfo.id} 元素已从DOM中移除`);
            }
            
            // 强制垃圾回收
            setTimeout(() => {
                try {
                    // 重置所有状态
                    gifInfo.loadAttempts = 0;
                    gifInfo.isLoading = false;
                    gifInfo.operationInProgress = false;
                    gifInfo.lastLoadTimestamp = 0;
                    gifInfo.currentLoadAttemptId = 0;
                    
                    console.log(`GIF ${gifInfo.id} 所有状态已重置，准备重新创建GIF元素`);
                    
                    // 创建新的GIF元素
                    const newGifElement = document.createElement('img');
                    gifInfo.element = newGifElement;
                    
                    // 设置元素样式
                    newGifElement.style.position = 'absolute';
                    newGifElement.style.zIndex = '1'; // 确保在Canvas之上
                    newGifElement.style.pointerEvents = 'none'; // 不干扰鼠标事件
                    
                    // 添加alt属性提高可访问性
                    newGifElement.setAttribute('alt', `Dynamic background animation ${gifInfo.id}`);
                    
                    // 添加到容器
                    const dynamicContainer = document.getElementById('dynamic-background-container') || 
                                           document.querySelector('.background-container');
                    
                    if (dynamicContainer) {
                        dynamicContainer.appendChild(newGifElement);
                        
                        // 重新绑定事件
                        this.bindGifEvents(gifInfo);
                        
                        // 开始加载
                        this.startGifLoading(gifInfo);
                        
                        console.log(`GIF动画 ${gifInfo.id} 完全重新初始化完成`);
                    } else {
                        console.error('未找到背景容器，无法重新添加GIF元素');
                    }
                } catch (err) {
                    console.error(`重置GIF ${gifInfo.id} 状态时出错:`, err);
                    // 如果失败，5秒后再次尝试
                    setTimeout(() => {
                        this.reinitializeGifAnimation(gifInfo);
                    }, 5000);
                }
            }, 300);
        } catch (err) {
            console.error(`完全重新初始化GIF动画 ${gifInfo.id} 时出错:`, err);
        }
    }

    
    // 清理单个GIF元素的资源
    cleanupGifElements() {
        // 清除所有GIF元素
        this.gifElements.forEach(gifInfo => {
            // 清除重置定时器
            if (gifInfo.resetInterval) {
                clearInterval(gifInfo.resetInterval);
                gifInfo.resetInterval = null;
            }
            
            // 移除元素
            if (gifInfo.element && gifInfo.element.parentNode) {
                gifInfo.element.onload = null;
                gifInfo.element.onerror = null;
                gifInfo.element.parentNode.removeChild(gifInfo.element);
                gifInfo.element = null;
            }
        });
        
        // 清空数组
        this.gifElements = [];
    }
    
    // 清理资源，避免内存泄漏
    cleanup() {
        // 清理所有GIF元素
        this.cleanupGifElements();
        
        console.log('CanvasBackground资源已清理');
    }
    
    // 更新单个GIF动画的位置和大小
    updateGifPosition(gifInfo) {
        if (!gifInfo || !gifInfo.element || !gifInfo.params) return;
        
        // 确保GIF已经加载完成
        if (!gifInfo.element.complete || gifInfo.element.naturalWidth === 0) {
            console.warn(`GIF动画 ${gifInfo.id} 尚未完全加载，无法正确计算尺寸`);
            return;
        }
        
        const container = document.querySelector('.background-container');
        let containerWidth, containerHeight;
        
        if (container) {
            const rect = container.getBoundingClientRect();
            containerWidth = rect.width;
            containerHeight = rect.height;
        } else {
            // 如果没有找到容器，使用窗口尺寸
            containerWidth = window.innerWidth;
            containerHeight = window.innerHeight;
        }
        
        // 计算GIF的缩放尺寸
        const naturalWidth = gifInfo.element.naturalWidth;
        const naturalHeight = gifInfo.element.naturalHeight;
        const scaledWidth = naturalWidth * gifInfo.params.scale;
        const scaledHeight = naturalHeight * gifInfo.params.scale;
        
        // 设置GIF元素的CSS样式
        gifInfo.element.style.width = scaledWidth + 'px';
        gifInfo.element.style.height = scaledHeight + 'px';
        gifInfo.element.style.left = (containerWidth * gifInfo.params.x - scaledWidth * gifInfo.params.anchorX) + 'px';
        gifInfo.element.style.bottom = (containerHeight * (1 - gifInfo.params.y) - scaledHeight * (1 - gifInfo.params.anchorY)) + 'px';
        
        console.log(`GIF动画 ${gifInfo.id} 位置已更新 - 容器尺寸: ${containerWidth}x${containerHeight}, GIF尺寸: ${scaledWidth}x${scaledHeight}, 位置: (${containerWidth * gifInfo.params.x - scaledWidth * gifInfo.params.anchorX}, ${containerHeight * (1 - gifInfo.params.y) - scaledHeight * (1 - gifInfo.params.anchorY)})`);
    };


    // 调整Canvas大小以匹配窗口
    resizeCanvas() {
        const container = document.querySelector('.background-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            
            console.log('Canvas已调整大小:', rect.width, 'x', rect.height);
        } else {
            // 如果没有找到容器，使用窗口尺寸
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
        }
        
        // 调整大小后重新渲染
        this.render();
        
        // 调整所有GIF动画元素的位置和大小
        this.gifElements.forEach(gifInfo => {
            this.updateGifPosition(gifInfo);
        });
    }

    // 渲染背景元素
    render() {
        if (!this.ctx) return;
        
        // 清空Canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染每个背景元素 - 立即渲染，不等待图片完全加载完成
        this.backgroundImages.forEach(imgInfo => {
            const img = imgInfo.image;
            const scale = imgInfo.scale;
            const x = this.canvas.width * imgInfo.x;
            const y = this.canvas.height * imgInfo.y;
            
            // 图片尚未加载完成时，我们仍然继续位置更新
            // 这样当图片最终加载完成时，就已经处于正确的动画位置
            
            // 只有当图片有宽度信息时才进行绘制（确保图片已经开始加载）
            if (img.complete && img.naturalWidth > 0) {
                // 计算缩放后的尺寸
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                
                // 计算绘制位置（考虑锚点）
                const drawX = x - (scaledWidth * imgInfo.anchorX);
                const drawY = y - (scaledHeight * imgInfo.anchorY);
                
                // 绘制图片
                this.ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
            }
        });
    };


    // 更新动画状态
    updateAnimation() {
        if (this.backgroundImages.length === 0) return;
        
        const canvasWidth = this.canvas ? this.canvas.width : window.innerWidth;
        
        // 更新每个背景元素的位置 - 立即开始动画，不等待图片加载完成
        this.backgroundImages.forEach(imgInfo => {
            // 确保图片已加载完成并设置宽度
            if (imgInfo.image.complete && imgInfo.image.naturalWidth > 0 && imgInfo.width === 0) {
                imgInfo.width = imgInfo.image.width * imgInfo.scale;
            }
            
            // 如果direction为0，表示元素静止不动，跳过移动逻辑
            if (imgInfo.direction === 0) {
                return;
            }
            
            // 根据固定方向移动元素 - 无论图片是否加载完成，都继续移动位置
            if (imgInfo.direction === -1) {
                // 从右到左移动 (Backgroundelements02.png)
                imgInfo.x -= imgInfo.speed;
                
                // 如果图片已加载完成，进行边界检查和重置
                if (imgInfo.width > 0) {
                    // 检查是否完全移出左侧屏幕
                    // 计算图片完全离开屏幕需要的位置（考虑图片宽度）
                    const leftEdge = -(imgInfo.width / canvasWidth) / 2;
                    if (imgInfo.x < leftEdge) {
                        // 重置到右侧屏幕外，准备重新进入
                        imgInfo.x = 1.1 + (imgInfo.width / canvasWidth) / 2; // 使用更靠近屏幕的位置
                        // 随机调整速度，使移动更自然
                        imgInfo.speed = 0.0009 + Math.random() * 0.0018; // 移动速度降低10%
                    }
                } else {
                    // 图片尚未加载完成，但继续移动位置，确保加载后能立即显示在正确位置
                    // 为防止位置溢出，这里设置一个简单的边界检查
                    if (imgInfo.x < -0.5) {
                        imgInfo.x = 1.1; // 使用更靠近屏幕的位置
                    }
                }
            } else if (imgInfo.direction === 1) {
                // 从左到右移动 (Backgroundelements03.png)
                imgInfo.x += imgInfo.speed;
                
                // 如果图片已加载完成，进行边界检查和重置
                if (imgInfo.width > 0) {
                    // 检查是否完全移出右侧屏幕
                    // 计算图片完全离开屏幕需要的位置（考虑图片宽度）
                    const rightEdge = 1 + (imgInfo.width / canvasWidth) / 2;
                    if (imgInfo.x > rightEdge) {
                        // 重置到左侧屏幕外，准备重新进入
                        imgInfo.x = -0.1 - (imgInfo.width / canvasWidth) / 2; // 使用更靠近屏幕的位置
                        // 随机调整速度，使移动更自然
                        imgInfo.speed = 0.0009 + Math.random() * 0.0018; // 移动速度降低10%
                    }
                } else {
                    // 图片尚未加载完成，但继续移动位置，确保加载后能立即显示在正确位置
                    // 为防止位置溢出，这里设置一个简单的边界检查
                    if (imgInfo.x > 1.5) {
                        imgInfo.x = -0.1; // 使用更靠近屏幕的位置
                    }
                }
            }
        });
    }
    
    // 开始渲染循环
    startRenderLoop() {
        // 使用requestAnimationFrame来创建渲染循环
        const renderLoop = () => {
            this.updateAnimation();
            this.render();
            requestAnimationFrame(renderLoop);
        };
        
        renderLoop();
    }
}

// 创建单例实例
const canvasBackground = new CanvasBackground();

// 将功能暴露到全局作用域
window.CanvasBackground = CanvasBackground;
window.canvasBackground = canvasBackground;

// 初始化Canvas背景
function initCanvasBackground() {
    try {
        canvasBackground.init();
    } catch (error) {
        console.error('初始化Canvas背景时出错:', error);
    }
}

// 在DOM加载完成后初始化Canvas背景
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvasBackground);
} else {
    initCanvasBackground();
}