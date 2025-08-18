// 应用主逻辑文件

// 全局应用对象
const MagicWallApp = {
  // 当前模式信息
  modeInfo: {
    isDebugMode: false,
    windowWidth: 0,
    windowHeight: 0
  },
  
  // 当前页面索引
  currentPageIndex: 0,
  
  // 页面集合
  pages: [],
  
  // 初始化应用
  init() {
    console.log('MagicWallApp 初始化开始');
    
    // 监听模式信息
    this.setupModeListener();
    
    // 如果没有模式信息，则显示模式选择对话框
    setTimeout(() => {
      if (!this.modeInfo) {
        this.showModeSelectionDialog();
      }
    }, 100);
    
    // 初始化页面
    this.initPages();
    
    // 设置事件监听器
    this.setupEventListeners();
    
    console.log('MagicWallApp 初始化完成');
  },
  
  // 设置模式监听器
  setupModeListener() {
    if (window.electronAPI) {
      window.electronAPI.onModeInfo((modeInfo) => {
        this.modeInfo = modeInfo;
        console.log('接收到模式信息:', this.modeInfo);
        this.onModeChanged();
      });
    }
  },
  
  // 显示模式选择对话框
  showModeSelectionDialog() {
    if (window.electronAPI) {
      window.electronAPI.selectMode();
      window.electronAPI.onModeSelected((result) => {
        console.log('用户选择了模式:', result);
        // 这里可以根据用户选择的模式进行相应的操作
        // 例如重新加载应用或调整界面
      });
    }
  },
  
  // 当初始化完成或模式改变时触发
  onModeChanged() {
    // 更新页面尺寸和布局
    this.updatePageLayout();
    
    // 在调试模式下显示调试信息
    if (this.modeInfo.isDebugMode) {
      this.showDebugInfo();
    }
  },
  
  // 初始化页面
  initPages() {
    // 这里可以从配置或文件中加载页面信息
    // 为了演示，我们创建一个简单的页面集合
    this.pages = [
      {
        id: 'page1',
        name: '首页',
        content: '<h2>欢迎使用MagicWall</h2><p>这是一个独立的Windows桌面原生应用程序，设计用于13.57米×1.8米的物理展示屏幕。</p>'
      },
      {
        id: 'page2',
        name: '功能介绍',
        content: '<h2>功能特点</h2><ul><li>独立原生应用，无需依赖浏览器</li><li>通过点击按钮或热点区域实现页面切换</li><li>页面上的小动画循环滚动播放</li><li>支持调试模式和产品模式</li></ul>'
      },
      {
        id: 'page3',
        name: '技术信息',
        content: '<h2>技术栈</h2><ul><li>框架：Electron.js</li><li>前端：HTML, CSS, JavaScript</li><li>构建工具：Electron Builder</li></ul>'
      }
    ];
    
    // 创建页面导航按钮
    this.createNavigationButtons();
    
    // 显示首页
    this.showPage(0);
  },
  
  // 创建页面导航按钮
  createNavigationButtons() {
    const navContainer = document.createElement('div');
    navContainer.className = 'navigation';
    
    this.pages.forEach((page, index) => {
      const button = document.createElement('button');
      button.className = 'nav-button';
      button.textContent = page.name;
      button.dataset.pageIndex = index;
      
      button.addEventListener('click', () => {
        this.showPage(index);
      });
      
      navContainer.appendChild(button);
    });
    
    document.body.appendChild(navContainer);
  },
  
  // 显示指定页面
  showPage(index) {
    if (index < 0 || index >= this.pages.length) {
      console.error('页面索引超出范围');
      return;
    }
    
    this.currentPageIndex = index;
    const page = this.pages[index];
    
    // 获取或创建内容容器
    let contentContainer = document.getElementById('content-container');
    if (!contentContainer) {
      contentContainer = document.createElement('div');
      contentContainer.id = 'content-container';
      document.body.appendChild(contentContainer);
    }
    
    // 添加过渡动画
    contentContainer.style.opacity = '0';
    
    setTimeout(() => {
      // 更新内容
      contentContainer.innerHTML = page.content;
      
      // 触发动画效果
      if (window.AnimationManager) {
        window.AnimationManager.startAnimations();
      }
      
      // 恢复透明度
      contentContainer.style.opacity = '1';
    }, 300);
    
    // 更新导航按钮状态
    this.updateNavigationButtons();
    
    console.log(`切换到页面: ${page.name}`);
  },
  
  // 更新导航按钮状态
  updateNavigationButtons() {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach((button, index) => {
      if (index === this.currentPageIndex) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  },
  
  // 设置事件监听器
  setupEventListeners() {
    // 窗口尺寸变化时更新布局
    window.addEventListener('resize', () => {
      this.updatePageLayout();
    });
    
    // 键盘事件监听
    document.addEventListener('keydown', (event) => {
      // 在调试模式下，支持左右箭头键切换页面
      if (this.modeInfo.isDebugMode) {
        switch (event.key) {
          case 'ArrowLeft':
            this.showPage((this.currentPageIndex - 1 + this.pages.length) % this.pages.length);
            break;
          case 'ArrowRight':
            this.showPage((this.currentPageIndex + 1) % this.pages.length);
            break;
        }
      }
    });
  },
  
  // 更新页面布局
  updatePageLayout() {
    // 这里可以根据窗口尺寸和模式调整页面布局
    // 例如调整字体大小、元素位置等
    console.log('更新页面布局');
  },
  
  // 显示调试信息
  showDebugInfo() {
    // 检查是否已存在调试信息面板
    let debugPanel = document.getElementById('debug-panel');
    if (!debugPanel) {
      debugPanel = document.createElement('div');
      debugPanel.id = 'debug-panel';
      document.body.appendChild(debugPanel);
    }
    
    // 更新调试信息
    debugPanel.innerHTML = `
      <div class="debug-info">
        <h3>调试信息</h3>
        <p>模式: ${this.modeInfo.isDebugMode ? '调试模式' : '产品模式'}</p>
        <p>窗口尺寸: ${this.modeInfo.windowWidth} x ${this.modeInfo.windowHeight}</p>
        <p>当前页面: ${this.currentPageIndex + 1}/${this.pages.length}</p>
      </div>
    `;
  }
};

// 当文档加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  // 等待AnimationManager加载完成
  const checkAnimationManager = setInterval(() => {
    if (window.AnimationManager || !window.electronAPI) {
      clearInterval(checkAnimationManager);
      MagicWallApp.init();
    }
  }, 100);
});

// 导出应用对象
if (typeof module !== 'undefined') {
  module.exports = MagicWallApp;
} else {
  window.MagicWallApp = MagicWallApp;
}