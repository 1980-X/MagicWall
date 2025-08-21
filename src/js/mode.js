// 模式配置参数
module.exports.CONFIG = {
    // 产品模式下的屏幕尺寸
    SCREEN_WIDTH: 9050,     // 对应9.05米
    SCREEN_HEIGHT: 1800,    // 对应1.80米
    SCREEN_RATIO: 5.028,    // 9.05米 / 1.80米 的比例
    
    // 调试模式下的窗口尺寸
    DEBUG_WINDOW_HEIGHT: 600,
    DEBUG_WINDOW_WIDTH: 3017,  // 根据屏幕比例自动计算，600 * 5.028 ≈ 3017
    
    // 默认模式设置
    DEFAULT_MODE: 'debug',    // 'debug' 或 'production'
    
    // 自动模式切换阈值
    PRODUCTION_MODE_THRESHOLD_WIDTH: 8000, // 屏幕宽度超过此值时视为物理屏幕
    AUTO_MODE_ENABLED: true // 是否启用自动模式检测
};

// 检测当前是否为开发环境
module.exports.isDevEnvironment = function() {
    return process.env.NODE_ENV !== 'production';
};

// 获取当前屏幕的尺寸
module.exports.detectScreenSize = function(screen) {
    if (!screen) {
        console.warn('screen对象未提供，使用默认尺寸');
        return { width: 1920, height: 1080 };
    }
    
    const primaryDisplay = screen.getPrimaryDisplay();
    return primaryDisplay.workAreaSize;
};

// 根据屏幕宽度自动计算高度，保持正确比例
module.exports.calculateHeightByWidth = function(width) {
    const { SCREEN_RATIO } = module.exports.CONFIG;
    return Math.floor(width / SCREEN_RATIO);
};

// 根据屏幕宽度自动计算宽度，保持正确比例
module.exports.calculateWidthByHeight = function(height) {
    const { SCREEN_RATIO } = module.exports.CONFIG;
    return Math.floor(height * SCREEN_RATIO);
};

// 自动检测应该使用哪种模式
module.exports.detectModeAutomatically = function(screen) {
    const { AUTO_MODE_ENABLED, PRODUCTION_MODE_THRESHOLD_WIDTH, DEFAULT_MODE } = module.exports.CONFIG;
    
    if (!AUTO_MODE_ENABLED) {
        return DEFAULT_MODE;
    }
    
    const screenSize = module.exports.detectScreenSize(screen);
    
    // 如果屏幕宽度接近或超过物理屏幕尺寸，使用产品模式
    if (screenSize.width >= PRODUCTION_MODE_THRESHOLD_WIDTH) {
        return 'production';
    } else {
        return 'debug';
    }
};

// 判断是否应打开开发者工具
module.exports.shouldOpenDevTools = function() {
    // 可以通过环境变量控制
    return process.env.OPEN_DEV_TOOLS !== 'false';
};

// 计算调试模式下的窗口尺寸
module.exports.calculateDebugWindowSize = function() {
    const { SCREEN_RATIO, DEBUG_WINDOW_HEIGHT } = module.exports.CONFIG;
    return {
        width: Math.floor(DEBUG_WINDOW_HEIGHT * SCREEN_RATIO),
        height: DEBUG_WINDOW_HEIGHT
    };
};

// 计算产品模式下的窗口尺寸
module.exports.calculateProductionWindowSize = function() {
    const { SCREEN_WIDTH, SCREEN_HEIGHT } = module.exports.CONFIG;
    return {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    };
};

// 根据当前屏幕尺寸调整窗口大小
module.exports.adjustWindowSizeForScreen = function(window, mode) {
    const { screen } = window;
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    
    if (mode === 'debug') {
        // 调试模式下，如果计算出的窗口尺寸超过屏幕，按比例缩小
        const debugSize = module.exports.calculateDebugWindowSize();
        
        let scaleFactor = 1;
        if (debugSize.width > width || debugSize.height > height) {
            const widthScale = width / debugSize.width;
            const heightScale = height / debugSize.height;
            scaleFactor = Math.min(widthScale, heightScale, 0.9); // 预留10%的边距
        }
        
        return {
            width: Math.floor(debugSize.width * scaleFactor),
            height: Math.floor(debugSize.height * scaleFactor)
        };
    } else {
        // 产品模式下返回实际尺寸
        return module.exports.calculateProductionWindowSize();
    }
};