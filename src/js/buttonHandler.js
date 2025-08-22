/**
 * 按钮点击效果处理器
 * 负责处理按钮的选中和未选中状态切换
 */
class ButtonHandler {
    constructor() {
        this.buttons = {};
        this.init();
    }

    // 初始化按钮事件监听
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupButtons();
        });
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
            this.selectButton(buttonId);
        });

        // 鼠标释放事件 - 恢复未选中状态
        button.addEventListener('mouseup', () => {
            this.deselectButton(buttonId);
        });

        // 鼠标离开事件 - 如果按钮在按下状态时鼠标离开，也恢复未选中状态
        button.addEventListener('mouseleave', () => {
            if (buttonData.isSelected) {
                this.deselectButton(buttonId);
            }
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
}

// 创建单例实例
const buttonHandler = new ButtonHandler();

// 将功能暴露到全局作用域，使其在传统脚本加载方式下可用
window.ButtonHandler = ButtonHandler;
window.buttonHandler = buttonHandler;