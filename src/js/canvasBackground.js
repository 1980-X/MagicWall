// 使用Canvas来渲染和控制背景元素
class CanvasBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.backgroundImages = [];
        this.isInitialized = false;
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
    
    // 设置GIF动画元素
    setupGifAnimation() {
        // 创建img元素用于显示GIF动画
        this.gifElement = document.createElement('img');
        this.gifElement.src = './assets/images/OverallBackground/BackgroundDynamics (Elements)/Dynamic-(element)01.gif';
        this.gifElement.style.position = 'absolute';
        this.gifElement.style.zIndex = '1'; // 确保在Canvas之上
        this.gifElement.style.pointerEvents = 'none'; // 不干扰鼠标事件
        
        // 设置GIF动画的初始位置和大小参数
        this.gifParams = {
            scale: 0.05625, // 等比例缩小75%，保留25%的大小（0.225 × 0.25）
            x: 0.0094325, // 初始X位置 - 从0.013475基础上再次向左移动30%（0.013475 × 0.7）
            y: 1, // 始终贴着底部
            anchorX: 0, // 左对齐
            anchorY: 1 // 下对齐
        };
        
        // 添加到动态背景容器
        const dynamicContainer = document.getElementById('dynamic-background-container');
        if (dynamicContainer) {
            dynamicContainer.appendChild(this.gifElement);
            console.log('GIF动画元素已成功添加到动态背景容器');
        } else {
            // 如果没有找到动态背景容器，回退到主背景容器
            const backgroundContainer = document.querySelector('.background-container');
            if (backgroundContainer) {
                backgroundContainer.appendChild(this.gifElement);
                console.log('GIF动画元素已成功添加到主背景容器');
            } else {
                console.error('未找到背景容器，GIF动画元素无法添加到页面');
            }
        }
        
        // 监听GIF加载完成事件
        this.gifElement.onload = () => {
            console.log('GIF动画已加载完成，开始播放');
            // 初始调整GIF位置和大小
            this.updateGifPosition();
        };
        
        this.gifElement.onerror = (e) => {
            console.error('加载GIF动画失败:', e);
        };
    }
    
    // 更新GIF动画的位置和大小
    updateGifPosition() {
        if (!this.gifElement || !this.gifParams) return;
        
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
        const scaledWidth = this.gifElement.naturalWidth * this.gifParams.scale;
        const scaledHeight = this.gifElement.naturalHeight * this.gifParams.scale;
        
        // 设置GIF的CSS样式
        this.gifElement.style.width = scaledWidth + 'px';
        this.gifElement.style.height = scaledHeight + 'px';
        this.gifElement.style.left = (containerWidth * this.gifParams.x - scaledWidth * this.gifParams.anchorX) + 'px';
        this.gifElement.style.bottom = (containerHeight * (1 - this.gifParams.y) - scaledHeight * (1 - this.gifParams.anchorY)) + 'px';
    }

    // 调整Canvas大小以匹配窗口
    resizeCanvas() {
        const container = document.querySelector('.background-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            
            // 调整Canvas样式尺寸
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
        
        // 调整GIF动画元素的位置和大小
        this.updateGifPosition();
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
    }

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