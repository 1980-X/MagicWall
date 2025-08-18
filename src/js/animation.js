/**
 * 动画效果模块
 * 负责处理页面上的小动画循环滚动播放
 */

/**
 * 动画管理器类
 */
class AnimationManager {
    constructor() {
        this.animations = []; // 存储所有动画元素
        this.isRunning = false; // 动画是否运行中
        this.init();
    }

    /**
     * 初始化动画管理器
     */
    init() {
        // 监听模式变更事件
        document.addEventListener('modeChanged', (e) => {
            this.handleModeChange(e.detail.mode);
        });

        // 监听页面切换事件
        document.addEventListener('pageChanged', (e) => {
            this.handlePageChange(e.detail.page);
        });

        // 初始化所有页面的动画容器
        this.initAnimationContainers();

        // 启动动画
        this.startAnimation();
    }

    /**
     * 初始化所有页面的动画容器
     */
    initAnimationContainers() {
        const containers = document.querySelectorAll('.animation-container');
        containers.forEach((container, index) => {
            // 为每个容器创建动画元素
            this.createAnimationElements(container, index + 1);
        });
    }

    /**
     * 为指定容器创建动画元素
     * @param {HTMLElement} container - 动画容器
     * @param {number} pageNum - 页面编号
     */
    createAnimationElements(container, pageNum) {
        // 清空容器
        container.innerHTML = '';

        // 创建5-10个随机动画元素
        const elementCount = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.classList.add('animation-element');

            // 随机样式
            const size = Math.floor(Math.random() * 40) + 20; // 20-60px
            const speed = Math.floor(Math.random() * 3) + 1; // 1-3px/frame
            const delay = Math.floor(Math.random() * 5000); // 0-5s delay
            const direction = Math.random() > 0.5 ? 1 : -1; // 方向

            // 随机颜色（根据页面编号变化基色）
            const hue = (pageNum * 60 + i * 30) % 360;
            const color = `hsl(${hue}, 70%, 50%)`;

            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.backgroundColor = color;
            element.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            element.style.position = 'absolute';
            element.style.top = `${Math.random() * (container.offsetHeight - size)}px`;
            element.style.left = direction > 0 ? `-100px` : `${container.offsetWidth}px`;
            element.style.opacity = (Math.random() * 0.5 + 0.5).toString();

            // 存储动画属性
            element.dataset.speed = speed * direction;
            element.dataset.delay = delay;
            element.dataset.originalLeft = element.style.left;
            element.dataset.originalTop = element.style.top;

            container.appendChild(element);
            this.animations.push(element);
        }
    }

    /**
     * 启动动画
     */
    startAnimation() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.animate();
    }

    /**
     * 停止动画
     */
    stopAnimation() {
        this.isRunning = false;
    }

    /**
     * 动画循环
     */
    animate() {
        if (!this.isRunning) return;

        this.animations.forEach((element) => {
            const container = element.parentElement;
            const speed = parseFloat(element.dataset.speed);
            const delay = parseFloat(element.dataset.delay);
            const currentTime = performance.now();

            // 应用延迟
            if (currentTime < delay) return;

            // 获取当前位置
            let left = parseFloat(element.style.left || 0);

            // 更新位置
            left += speed;

            // 检查是否超出边界
            if (speed > 0 && left > container.offsetWidth) {
                left = -element.offsetWidth;
            } else if (speed < 0 && left < -element.offsetWidth) {
                left = container.offsetWidth;
            }

            // 应用新位置
            element.style.left = `${left}px`;
        });

        // 请求下一帧
        requestAnimationFrame(() => this.animate());
    }

    /**
     * 处理模式变更
     * @param {string} mode - 新模式
     */
    handleModeChange(mode) {
        // 根据模式调整动画
        if (mode === 'debug') {
            // 调试模式下可能需要调整动画速度或大小
        } else {
            // 产品模式下恢复默认设置
        }
    }

    /**
     * 处理页面变更
     * @param {number} pageNum - 新页面编号
     */
    handlePageChange(pageNum) {
        // 可以根据页面不同调整动画效果
    }
}

// 导出动画管理器实例
const animationManager = new AnimationManager();
export default animationManager;