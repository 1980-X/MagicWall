// 动画管理器

const AnimationManager = {
  // 动画集合
  animations: [],
  
  // 动画帧ID
  animationFrameId: null,
  
  // 动画是否正在运行
  isRunning: false,
  
  // 初始化动画管理器
  init() {
    console.log('动画管理器初始化...');
    
    // 清空现有动画
    this.animations = [];
    
    // 如果是在浏览器环境中，等待DOM加载完成
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.createAnimations();
        });
      } else {
        this.createAnimations();
      }
    }
    
    console.log('动画管理器初始化完成');
  },
  
  // 创建默认动画
  createAnimations() {
    // 创建几个演示动画
    this.createFloatingElements();
    this.createColorCyclingElements();
    this.createPulsingElements();
  },
  
  // 创建浮动元素动画
  createFloatingElements() {
    // 检查是否已有浮动元素
    let container = document.querySelector('.floating-elements');
    if (!container) {
      container = document.createElement('div');
      container.className = 'floating-elements';
      document.body.appendChild(container);
    }
    
    // 创建5个浮动元素
    for (let i = 0; i < 5; i++) {
      const element = document.createElement('div');
      element.className = 'floating-element';
      
      // 随机设置初始位置和大小
      const size = 20 + Math.random() * 30;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;
      
      // 随机设置背景颜色
      const hue = Math.random() * 360;
      element.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
      
      // 添加到容器
      container.appendChild(element);
      
      // 添加到动画集合
      this.animations.push({
        element: element,
        type: 'floating',
        speed: 0.5 + Math.random() * 2,
        directionX: Math.random() - 0.5,
        directionY: Math.random() - 0.5,
        offset: 0
      });
    }
  },
  
  // 创建颜色循环元素动画
  createColorCyclingElements() {
    // 检查是否已有颜色循环元素
    let container = document.querySelector('.color-cycling-elements');
    if (!container) {
      container = document.createElement('div');
      container.className = 'color-cycling-elements';
      document.body.appendChild(container);
    }
    
    // 创建3个颜色循环元素
    for (let i = 0; i < 3; i++) {
      const element = document.createElement('div');
      element.className = 'color-cycling-element';
      
      // 设置位置和大小
      element.style.width = '60px';
      element.style.height = '60px';
      element.style.left = `${25 + i * 25}%`;
      element.style.bottom = '10%';
      
      // 添加到容器
      container.appendChild(element);
      
      // 添加到动画集合
      this.animations.push({
        element: element,
        type: 'colorCycle',
        speed: 0.5 + Math.random(),
        hue: Math.random() * 360
      });
    }
  },
  
  // 创建脉冲元素动画
  createPulsingElements() {
    // 检查是否已有脉冲元素
    let container = document.querySelector('.pulsing-elements');
    if (!container) {
      container = document.createElement('div');
      container.className = 'pulsing-elements';
      document.body.appendChild(container);
    }
    
    // 创建4个脉冲元素
    for (let i = 0; i < 4; i++) {
      const element = document.createElement('div');
      element.className = 'pulsing-element';
      
      // 设置位置和大小
      element.style.width = '40px';
      element.style.height = '40px';
      element.style.right = `${15 + i * 15}%`;
      element.style.top = `${20 + i * 15}%`;
      
      // 添加到容器
      container.appendChild(element);
      
      // 添加到动画集合
      this.animations.push({
        element: element,
        type: 'pulse',
        speed: 1 + Math.random() * 2,
        scale: 1,
        growing: true
      });
    }
  },
  
  // 启动所有动画
  startAnimations() {
    if (this.isRunning) {
      return;
    }
    
    this.isRunning = true;
    console.log('开始播放动画');
    
    // 如果没有动画，创建一些默认动画
    if (this.animations.length === 0) {
      this.createAnimations();
    }
    
    // 开始动画循环
    this.animate();
  },
  
  // 停止所有动画
  stopAnimations() {
    if (!this.isRunning) {
      return;
    }
    
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    console.log('停止动画');
  },
  
  // 动画循环函数
  animate() {
    if (!this.isRunning) {
      return;
    }
    
    // 更新所有动画
    this.updateAnimations();
    
    // 请求下一帧
    this.animationFrameId = requestAnimationFrame(() => {
      this.animate();
    });
  },
  
  // 更新所有动画
  updateAnimations() {
    for (const animation of this.animations) {
      switch (animation.type) {
        case 'floating':
          this.updateFloatingAnimation(animation);
          break;
        case 'colorCycle':
          this.updateColorCycleAnimation(animation);
          break;
        case 'pulse':
          this.updatePulseAnimation(animation);
          break;
      }
    }
  },
  
  // 更新浮动动画
  updateFloatingAnimation(animation) {
    const element = animation.element;
    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 更新偏移量
    animation.offset += animation.speed * 0.016; // 假设60fps
    
    // 计算新位置（使用正弦和余弦函数创建更自然的运动）
    const x = Math.sin(animation.offset * animation.speed) * animation.directionX;
    const y = Math.cos(animation.offset * animation.speed) * animation.directionY;
    
    // 获取当前位置
    const currentLeft = parseFloat(element.style.left) || 0;
    const currentTop = parseFloat(element.style.top) || 0;
    
    // 计算新位置（百分比）
    let newLeft = currentLeft + x;
    let newTop = currentTop + y;
    
    // 边界检查
    if (newLeft < 0) newLeft = 0;
    if (newLeft > 100) newLeft = 100;
    if (newTop < 0) newTop = 0;
    if (newTop > 100) newTop = 100;
    
    // 更新位置
    element.style.left = `${newLeft}%`;
    element.style.top = `${newTop}%`;
  },
  
  // 更新颜色循环动画
  updateColorCycleAnimation(animation) {
    // 更新色相值
    animation.hue = (animation.hue + animation.speed * 0.08) % 360;
    
    // 更新元素颜色
    animation.element.style.backgroundColor = `hsl(${animation.hue}, 70%, 50%)`;
    animation.element.style.boxShadow = `0 0 20px hsl(${animation.hue}, 70%, 50%)`;
  },
  
  // 更新脉冲动画
  updatePulseAnimation(animation) {
    // 更新缩放值
    if (animation.growing) {
      animation.scale += animation.speed * 0.008;
      if (animation.scale > 1.5) {
        animation.growing = false;
      }
    } else {
      animation.scale -= animation.speed * 0.008;
      if (animation.scale < 1) {
        animation.growing = true;
      }
    }
    
    // 更新元素缩放
    animation.element.style.transform = `scale(${animation.scale})`;
    
    // 更新透明度
    const opacity = 0.5 + 0.5 * (animation.scale - 1) / 0.5;
    animation.element.style.opacity = opacity;
  },
  
  // 添加自定义动画
  addAnimation(element, animationType, options = {}) {
    // 检查元素是否存在
    if (!element) {
      console.error('元素不存在');
      return;
    }
    
    // 创建动画对象
    const animation = {
      element: element,
      type: animationType,
      speed: options.speed || 1,
      ...options
    };
    
    // 添加到动画集合
    this.animations.push(animation);
    
    // 如果动画管理器正在运行，确保自定义动画也能运行
    if (this.isRunning) {
      // 确保动画在下一帧被处理
    }
    
    return animation;
  },
  
  // 移除动画
  removeAnimation(animation) {
    const index = this.animations.indexOf(animation);
    if (index !== -1) {
      this.animations.splice(index, 1);
    }
  },
  
  // 清空所有动画
  clearAnimations() {
    this.stopAnimations();
    this.animations = [];
    
    // 移除创建的动画元素
    const animationContainers = document.querySelectorAll('.floating-elements, .color-cycling-elements, .pulsing-elements');
    animationContainers.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
  }
};

// 导出动画管理器
if (typeof module !== 'undefined') {
  module.exports = AnimationManager;
} else {
  window.AnimationManager = AnimationManager;
}

// 如果在浏览器环境中，自动初始化动画管理器
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  // 延迟初始化，确保DOM已加载
  setTimeout(() => {
    AnimationManager.init();
  }, 100);
}