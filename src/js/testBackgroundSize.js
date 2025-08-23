// 测试背景元素大小的脚本
window.addEventListener('load', function() {
    setTimeout(function() {
        console.log('===== 背景元素大小测试 =====');
        
        // 输出所有元素信息以便调试
        console.log('页面上所有元素:', document.querySelectorAll('*').length);
        console.log('所有带ID的元素:', document.querySelectorAll('[id]').length);
        
        // 列出所有带ID的元素
        const allElementsWithId = document.querySelectorAll('[id]');
        console.log('带ID的元素列表:');
        allElementsWithId.forEach(el => {
            if (el.id.includes('background') || el.id.includes('element')) {
                console.log('  -', el.id, ':', el.tagName, el.classList.toString());
            }
        });
        
        // 获取新的背景元素
        const elements02 = document.getElementById('elements-02');
        const elements03 = document.getElementById('elements-03');
        const wrapper = document.getElementById('auxiliary-wrapper');
        
        // 获取最新的背景元素实现
        const newWrapper = document.getElementById('new-background-wrapper');
        const newElement02 = document.getElementById('new-element-02');
        const newElement03 = document.getElementById('new-element-03');
        
        // 输出元素信息
        if (elements02) {
            const rect02 = elements02.getBoundingClientRect();
            console.log('elements-02:', {
                width: rect02.width,
                height: rect02.height,
                styleWidth: elements02.style.width,
                styleHeight: elements02.style.height,
                computedWidth: getComputedStyle(elements02).width,
                computedHeight: getComputedStyle(elements02).height,
                backgroundImage: getComputedStyle(elements02).backgroundImage,
                className: elements02.className
            });
        } else {
            console.log('未找到elements-02元素');
        }
        
        if (elements03) {
            const rect03 = elements03.getBoundingClientRect();
            console.log('elements-03:', {
                width: rect03.width,
                height: rect03.height,
                styleWidth: elements03.style.width,
                styleHeight: elements03.style.height,
                computedWidth: getComputedStyle(elements03).width,
                computedHeight: getComputedStyle(elements03).height,
                backgroundImage: getComputedStyle(elements03).backgroundImage,
                className: elements03.className
            });
        } else {
            console.log('未找到elements-03元素');
        }
        
        if (wrapper) {
            console.log('wrapper:', {
                position: getComputedStyle(wrapper).position,
                bottom: getComputedStyle(wrapper).bottom,
                left: getComputedStyle(wrapper).left,
                width: getComputedStyle(wrapper).width,
                display: getComputedStyle(wrapper).display
            });
        } else {
            console.log('未找到auxiliary-wrapper元素');
        }
        
        // 输出最新背景元素的信息
        if (newWrapper) {
            console.log('new-background-wrapper:', {
                position: getComputedStyle(newWrapper).position,
                bottom: getComputedStyle(newWrapper).bottom,
                left: getComputedStyle(newWrapper).left,
                width: getComputedStyle(newWrapper).width,
                height: getComputedStyle(newWrapper).height,
                zIndex: getComputedStyle(newWrapper).zIndex
            });
        } else {
            console.log('未找到new-background-wrapper元素');
        }
        
        if (newElement02) {
            const rectNew02 = newElement02.getBoundingClientRect();
            console.log('new-element-02:', {
                width: rectNew02.width,
                height: rectNew02.height,
                styleWidth: newElement02.style.width,
                styleHeight: newElement02.style.height,
                computedWidth: getComputedStyle(newElement02).width,
                computedHeight: getComputedStyle(newElement02).height,
                parentWidth: getComputedStyle(newElement02.parentElement).width,
                parentTransform: getComputedStyle(newElement02.parentElement).transform
            });
        } else {
            console.log('未找到new-element-02元素');
        }
        
        if (newElement03) {
            const rectNew03 = newElement03.getBoundingClientRect();
            console.log('new-element-03:', {
                width: rectNew03.width,
                height: rectNew03.height,
                styleWidth: newElement03.style.width,
                styleHeight: newElement03.style.height,
                computedWidth: getComputedStyle(newElement03).width,
                computedHeight: getComputedStyle(newElement03).height,
                parentWidth: getComputedStyle(newElement03.parentElement).width,
                parentTransform: getComputedStyle(newElement03.parentElement).transform
            });
        } else {
            console.log('未找到new-element-03元素');
        }
        
        // 检查是否有其他可能影响背景的脚本
        console.log('backgroundManager:', window.backgroundManager);
        if (window.backgroundManager && window.backgroundManager.backgroundElements) {
            console.log('backgroundManager管理的元素数量:', window.backgroundManager.backgroundElements.length);
            window.backgroundManager.backgroundElements.forEach(element => {
                if (element.id) {
                    console.log('backgroundManager管理的元素:', element.id);
                }
            });
        }
        
        console.log('当前模式:', document.body.classList.contains('debug-mode') ? '调试模式' : '产品模式');
        console.log('=========================');
    }, 1000); // 延迟1秒执行，确保所有脚本都已加载
});