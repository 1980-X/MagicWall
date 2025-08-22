// 动画管理器类
class AnimationManager {
    constructor() {
        this.animations = new Map(); // 存储所有动画
        this.isRunning = false;
        this.animationFrameId = null;
    }
    
    // 添加动画到管理器
    addAnimation(id, animation) {
        this.animations.set(id, animation);
    }
    
    // 移除动画
    removeAnimation(id) {
        this.animations.delete(id);
    }
    
    // 启动所有动画
    startAll() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        // 启动动画循环
        this.update();
    }
    
    // 停止所有动画
    stopAll() {
        if (!this.isRunning) return;
        this.isRunning = false;
        
        // 取消动画帧请求
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    // 更新所有动画
    update() {
        if (!this.isRunning) return;
        
        // 更新所有动画
        for (const [id, animation] of this.animations.entries()) {
            if (animation.update) {
                animation.update();
            }
        }
        
        // 请求下一帧动画
        this.animationFrameId = requestAnimationFrame(() => this.update());
    }
}

// 淡入淡出动画类
class FadeAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.duration = options.duration || 3000; // 默认3秒一个周期
        this.startTime = null;
        this.opacity = 0;
        this.direction = 1; // 1表示淡入，-1表示淡出
        
        // 初始化元素样式
        this.element.style.opacity = '0';
        this.element.style.transition = 'opacity 0.3s ease'; // 添加平滑过渡
    }
    
    update() {
        const currentTime = Date.now();
        if (!this.startTime) {
            this.startTime = currentTime;
        }
        
        // 计算当前进度（0-1）
        const elapsed = (currentTime - this.startTime) % this.duration;
        const progress = elapsed / this.duration;
        
        // 根据进度计算透明度
        if (progress < 0.5) {
            // 淡入阶段
            this.opacity = progress * 2;
        } else {
            // 淡出阶段
            this.opacity = (1 - progress) * 2;
        }
        
        // 应用透明度
        this.element.style.opacity = this.opacity.toString();
    }
}

// 创建单例实例
const animationManager = new AnimationManager();

// 将功能暴露到全局作用域，使其在传统脚本加载方式下可用
window.AnimationManager = AnimationManager;
window.animationManager = animationManager;
window.FadeAnimation = FadeAnimation;
window.initAnimations = function() {
    // 初始化动画系统
    try {
        // 获取需要添加动画的元素
        const fadeElement = document.getElementById('toc-element-01');
        
        if (fadeElement) {
            // 创建淡入淡出动画
            const fadeAnimation = new FadeAnimation(fadeElement, {
                duration: 5000 // 5秒一个周期，缓慢的隐现效果
            });
            
            // 添加动画到管理器
            animationManager.addAnimation('fade-element-01', fadeAnimation);
            
            // 启动所有动画
            animationManager.startAll();
        } else {
            console.warn('未找到元素toc-element-01，无法创建淡入淡出动画');
        }
    } catch (error) {
        console.error('初始化动画时出错:', error);
    }
};

window.startAnimations = function() {
    // 启动所有动画
    animationManager.startAll();
};

window.stopAnimations = function() {
    // 停止所有动画
    animationManager.stopAll();
};

window.createAnimation = function(options) {
    // 创建一个动画对象
    if (options && options.type === 'fade') {
        const element = document.getElementById(options.elementId);
        if (element) {
            return new FadeAnimation(element, options);
        }
    }
    return {};
};