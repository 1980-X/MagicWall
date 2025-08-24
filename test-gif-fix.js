// 测试GIF循环播放修复
// 这个脚本可以在浏览器控制台中运行，用于验证修复效果

console.log('=== 开始测试GIF循环播放修复 ===');

// 检查模式内容管理器是否存在
if (typeof window.modeContentManager !== 'undefined') {
    console.log('✅ 模式内容管理器已找到');
    
    // 检查当前GIF元素状态
    const gifElements = window.modeContentManager.gifElements;
    console.log(`当前GIF元素数量: ${gifElements.length}`);
    
    gifElements.forEach((gifInfo, index) => {
        console.log(`GIF ${index + 1}:`, {
            id: gifInfo.id,
            isLoading: gifInfo.isLoading,
            operationInProgress: gifInfo.operationInProgress,
            hasResetInterval: !!gifInfo.resetInterval,
            elementSrc: gifInfo.element ? gifInfo.element.src : 'no element'
        });
    });
    
    // 如果没有GIF元素，尝试切换到安全生产委员会模式
    if (gifElements.length === 0) {
        console.log('🔄 当前没有GIF元素，尝试切换到安全生产委员会模式...');
        window.modeContentManager.switchModeContent('button-03');
        
        // 延迟检查
        setTimeout(() => {
            const newGifElements = window.modeContentManager.gifElements;
            console.log(`切换后GIF元素数量: ${newGifElements.length}`);
            
            newGifElements.forEach((gifInfo, index) => {
                console.log(`新GIF ${index + 1}:`, {
                    id: gifInfo.id,
                    isLoading: gifInfo.isLoading,
                    operationInProgress: gifInfo.operationInProgress,
                    hasResetInterval: !!gifInfo.resetInterval
                });
            });
        }, 2000);
    }
} else {
    console.log('❌ 模式内容管理器未找到，请确保页面已完全加载');
}

// 10秒后再次检查状态
setTimeout(() => {
    console.log('=== 10秒后状态检查 ===');
    if (typeof window.modeContentManager !== 'undefined') {
        const gifElements = window.modeContentManager.gifElements;
        console.log(`最终GIF元素数量: ${gifElements.length}`);
        
        gifElements.forEach((gifInfo, index) => {
            console.log(`最终GIF ${index + 1}:`, {
                id: gifInfo.id,
                isLoading: gifInfo.isLoading,
                operationInProgress: gifInfo.operationInProgress,
                hasResetInterval: !!gifInfo.resetInterval,
                lastLoadTimestamp: gifInfo.lastLoadTimestamp,
                timeSinceLastLoad: Date.now() - gifInfo.lastLoadTimestamp
            });
        });
    }
}, 10000);