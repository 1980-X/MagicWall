/**
 * 按钮点击效果处理器
 * 负责处理按钮的选中和未选中状态切换
 */
class ButtonHandler {
    constructor() {
        this.buttons = {};
        this.currentActiveButton = null; // 存储当前激活的按钮ID
        this.init();
    }

    // 初始化按钮事件监听
    init() {
        // 使用更可靠的方式检测DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupButtons();
            });
        } else {
            // DOM已经加载完成，直接设置按钮
            setTimeout(() => {
                this.setupButtons();
            }, 0);
        }
    }

    // 设置所有按钮
    setupButtons() {
        const buttonElements = document.querySelectorAll('.button-container img');
        
        buttonElements.forEach(button => {
            const buttonId = button.id;
            this.buttons[buttonId] = {
                element: button,
                normalSrc: button.src,
                selectedSrc: button.dataset.selectedSrc,
                isSelected: false
            };

            this.addButtonEvents(buttonId);
        });
    }

    // 为按钮添加事件监听
    addButtonEvents(buttonId) {
        const buttonData = this.buttons[buttonId];
        const button = buttonData.element;

        // 鼠标按下事件 - 显示选中状态
        button.addEventListener('mousedown', () => {
            console.log('按钮按下:', buttonId);
            this.selectButton(buttonId);
        });

        // 鼠标释放事件 - 点击完成后保持选中状态并切换模式
        button.addEventListener('mouseup', () => {
            console.log('按钮释放:', buttonId);
            // 不再立即取消选中状态，而是维持选中状态
            this.setActiveButton(buttonId);
            // 这里可以添加模式切换的逻辑
        });

        // 鼠标离开事件 - 如果按钮在按下状态时鼠标离开，但如果是当前活动按钮则保持选中
        button.addEventListener('mouseleave', () => {
            console.log('鼠标离开按钮:', buttonId, '选中状态:', buttonData.isSelected, '当前活动按钮:', this.currentActiveButton);
            if (buttonData.isSelected && buttonId !== this.currentActiveButton) {
                this.deselectButton(buttonId);
            }
        });

        // 点击事件 - 确保按钮被点击时设置为活动状态
        button.addEventListener('click', () => {
            console.log('按钮点击:', buttonId);
            this.setActiveButton(buttonId);
        });
    }

    // 选中按钮
    selectButton(buttonId) {
        const buttonData = this.buttons[buttonId];
        if (buttonData && !buttonData.isSelected) {
            buttonData.element.src = buttonData.selectedSrc;
            buttonData.isSelected = true;
        }
    }

    // 取消选中按钮
    deselectButton(buttonId) {
        const buttonData = this.buttons[buttonId];
        if (buttonData && buttonData.isSelected) {
            buttonData.element.src = buttonData.normalSrc;
            buttonData.isSelected = false;
        }
    }

    // 设置活动按钮（维持被按下状态）
    setActiveButton(buttonId) {
        // 检查按钮是否已经初始化
        if (Object.keys(this.buttons).length === 0) {
            // 如果按钮尚未初始化，延迟设置
            setTimeout(() => {
                this.setActiveButton(buttonId);
            }, 100);
            return;
        }
        
        // 先取消所有按钮的选中状态
        Object.keys(this.buttons).forEach(id => {
            this.deselectButton(id);
        });
        
        // 选中当前按钮并设置为活动状态
        this.selectButton(buttonId);
        this.currentActiveButton = buttonId;
        
        // 这里可以触发模式切换的事件或回调
        this.onModeChange(buttonId);
    }

    // 当模式改变时的回调函数
    onModeChange(buttonId) {
        console.log('模式已改变，当前活动按钮:', buttonId);
        // 触发自定义事件，让应用其他部分知道模式已改变
        const modeChangeEvent = new CustomEvent('modeChange', {
            detail: { buttonId: buttonId }
        });
        document.dispatchEvent(modeChangeEvent);
    }

    // 获取当前活动按钮
    getCurrentActiveButton() {
        return this.currentActiveButton;
    }
}

// 创建单例实例
const buttonHandler = new ButtonHandler();

// 将功能暴露到全局作用域，使其在传统脚本加载方式下可用
window.ButtonHandler = ButtonHandler;
window.buttonHandler = buttonHandler;