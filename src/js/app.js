/**
 * 应用主逻辑模块
 * 负责处理页面切换和热点区域交互
 */

// 导入其他模块
import modeManager from './mode.js';
import animationManager from './animation.js';

/**
 * 应用管理器类
 */
class AppManager {
    constructor() {
        this.currentPage = 1;
        this.totalPages = document.querySelectorAll('.page').length;
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        // 初始化页面切换事件
        this.initPageNavigation();

        // 监听模式变更事件
        document.addEventListener('modeChanged', (e) => {
            this.handleModeChange(e.detail.mode);
        });

        // 初始化第一页
        this.showPage(this.currentPage);
    }

    /**
     * 初始化页面导航
     */
    initPageNavigation() {
        // 为所有热点区域添加点击事件
        const hotspots = document.querySelectorAll('.hotspot');
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', () => {
                const targetPage = parseInt(hotspot.dataset.target);
                this.showPage(targetPage);
            });
        });
    }

    /**
     * 显示指定页面
     * @param {number} pageNum - 页面编号
     */
    showPage(pageNum) {
        if (pageNum < 1 || pageNum > this.totalPages) {
            console.error('无效的页面编号:', pageNum);
            return;
        }

        // 隐藏当前页面
        document.querySelector('.page.active').classList.remove('active');

        // 显示目标页面
        const targetPage = document.querySelector(`.page[data-page="${pageNum}"]`);
        targetPage.classList.add('active');

        // 更新当前页面
        this.currentPage = pageNum;

        // 触发页面变更事件
        const event = new CustomEvent('pageChanged', { detail: { page: pageNum } });
        document.dispatchEvent(event);
    }

    /**
     * 处理模式变更
     * @param {string} mode - 新模式
     */
    handleModeChange(mode) {
        // 根据模式调整应用行为
        console.log(`应用模式已切换为: ${mode}`);

        // 在产品模式下，可能需要调整热点区域的大小和位置
        if (mode === 'product') {
            this.adjustHotspotsForProductMode();
        } else {
            this.resetHotspots();
        }
    }

    /**
     * 为产品模式调整热点区域
     */
    adjustHotspotsForProductMode() {
        const hotspots = document.querySelectorAll('.hotspot');
        hotspots.forEach(hotspot => {
            // 在产品模式下，热点区域可能需要更大尺寸以方便触摸
            hotspot.style.width = '150px';
            hotspot.style.height = '150px';
        });
    }

    /**
     * 重置热点区域
     */
    resetHotspots() {
        const hotspots = document.querySelectorAll('.hotspot');
        hotspots.forEach(hotspot => {
            hotspot.style.width = '100px';
            hotspot.style.height = '100px';
        });
    }
}

// 当页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 创建应用管理器实例
    const appManager = new AppManager();
});