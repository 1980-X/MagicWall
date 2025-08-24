// 初始化脚本，设置默认选中的模式按钮

// 等待页面加载完成
 document.addEventListener('DOMContentLoaded', function() {
    // 重试函数，确保按钮能够被正确选中
    function setDefaultButtonWithRetry(buttonId, maxRetries = 5, retryDelay = 100) {
        let retries = 0;
        
        function attemptSetButton() {
            retries++;
            
            if (window.buttonHandler && window.buttonHandler.setActiveButton) {
                console.log('尝试设置默认选中按钮:', buttonId, '尝试次数:', retries);
                window.buttonHandler.setActiveButton(buttonId);
            } else if (retries < maxRetries) {
                console.log('buttonHandler尚未准备就绪，将在', retryDelay, '毫秒后重试...');
                setTimeout(attemptSetButton, retryDelay);
            } else {
                console.error('超过最大重试次数，无法设置默认选中按钮');
            }
        }
        
        // 立即开始尝试
        attemptSetButton();
    }
    
    // 设置按钮3为默认选中状态（安全生产委员会模式）
    setDefaultButtonWithRetry('button-03');
    
    // 初始化模式内容管理器并设置默认内容
    setTimeout(() => {
        if (window.modeContentManager) {
            console.log('初始化模式内容管理器');
            window.modeContentManager.initializeContentContainers();
            // 设置默认模式内容
            window.modeContentManager.switchModeContent('button-03');
        } else {
            console.warn('模式内容管理器未就绪，将延迟初始化');
            setTimeout(() => {
                if (window.modeContentManager) {
                    window.modeContentManager.initializeContentContainers();
                    window.modeContentManager.switchModeContent('button-03');
                }
            }, 300);
        }
    }, 100);
    
    // 初始化动画
    if (window.initAnimations) {
        console.log('初始化动画系统');
        window.initAnimations();
    } else {
        console.warn('initAnimations函数未找到，将在延迟后重试');
        setTimeout(function() {
            if (window.initAnimations) {
                console.log('延迟初始化动画系统');
                window.initAnimations();
            }
        }, 500);
    }
    
    // 监听模式改变事件
    document.addEventListener('modeChange', function(event) {
        const buttonId = event.detail.buttonId;
        console.log('模式已切换，当前选中按钮:', buttonId);
        
        // 这里可以根据选中的按钮ID执行相应的模式切换逻辑
        // 例如更新模式内容、切换图片等
        
        // 示例：更新模式标题和描述
        const modeTitle = document.getElementById('mode-title');
        const modeDescription = document.getElementById('mode-description');
        
        if (modeTitle && modeDescription) {
            // 根据不同的按钮ID设置不同的内容
            switch(buttonId) {
                case 'button-01':
                    modeTitle.textContent = '应急管理委员会';
                    modeDescription.textContent = '2022年经自治区党委、自治区人民政府同意，将广西壮族自治区人民政府突发事件应急管理委员会更名为广西壮族自治区应急管理委员会，纳入自治区党委议事协调机构管理。';
                    break;
                case 'button-02':
                    modeTitle.textContent = '自治区防汛抗旱指挥部';
                    modeDescription.textContent = '自治区人民政府设立自治区防汛抗旱指挥部，负责领导、组织全区的防汛抗旱工作。自治区防汛抗旱指挥部办公室设在自治区应急管理厅，承担自治区防汛抗旱指挥部日常工作。';
                    break;
                case 'button-03':
                    modeTitle.textContent = '安全生产委员会';
                    modeDescription.textContent = '广西壮族自治区安全生产委员会是自治区人民政府议事协调机构，必须坚持以习近平新时代中国特色社会主义思想为指导，树牢"四个意识"，坚定"四个自信"，坚决做到"两个维护"，认真贯彻落实习近平总书记关于安全生产的重要论述和指示批示精神，认真贯彻落实党中央、国务院和自治区党委、自治区人民政府安全生产方面的方针政策和重大决策部署。';
                    break;
                case 'button-04':
                    modeTitle.textContent = '森林防灭火指挥部';
                    modeDescription.textContent = '广西壮族自治区森林防灭火指挥部是自治区人民政府议事协调机构，代表自治区人民政府行使森林防灭火工作指挥决策权力。坚持以习近平新时代中国特色社会主义思想为指导，树牢"四个意识"，坚定"四个自信"，做到"两个维护"，严格贯彻落实党中央、国务院、国家森防指和自治区党委、政府关于森林草原防灭火工作的方政政策和决策部署。';
                    break;
                case 'button-05':
                    modeTitle.textContent = '防灾减灾救灾委员会';
                    modeDescription.textContent = '为全面贯彻习近平总书记关于防灾减灾救灾的重要论述，2024年12月经自治区党委、自治区人民政府同意，整合设立广西壮族自治区防灾减灾救灾委员会，主要职责是负责统筹指导、协调和监督全区防灾减灾救灾工作。';
                    break;
                case 'button-06':
                    modeTitle.textContent = '抗震救灾指挥部';
                    modeDescription.textContent = '自治区人民政府设立自治区抗震救灾指挥部，负责贯彻落实党中央、国务院、国务院抗震救灾指挥部和自治区党委、自治区人民政府关于防震减灾和抗震救灾的方针政策和重大决策部署。自治区抗震救灾指挥部办公室设在自治区应急管理厅，承担自治区抗震救灾指挥部日常工作。';
                    break;
                default:
                    console.log('未知的按钮ID:', buttonId);
            }
        }
        
        // 调用模式内容管理器切换内容
        if (window.modeContentManager) {
            window.modeContentManager.switchModeContent(buttonId);
        }
    });
});