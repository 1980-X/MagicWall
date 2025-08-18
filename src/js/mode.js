// 模式配置文件

// 默认配置
const defaultConfig = {
  // 是否启用调试模式
  DEBUG_MODE: false,
  
  // 产品模式下的屏幕宽度（默认9050px，对应9.05米）
  SCREEN_WIDTH: 9050,
  
  // 产品模式下的屏幕高度（默认1800px，对应1.80米）
  SCREEN_HEIGHT: 1800,
  
  // 屏幕比例（9.05米 × 1.80米的比例）
  SCREEN_RATIO: 9.05 / 1.80,
  
  // 调试模式下的默认窗口高度
  DEBUG_WINDOW_HEIGHT: 600
};

// 从环境变量或其他配置源加载配置
function loadConfig() {
  const config = {
    ...defaultConfig
  };
  
  // 可以在这里添加从环境变量或配置文件加载配置的逻辑
  // 例如：如果有配置文件，可以读取配置文件并覆盖默认配置
  
  return config;
}

// 导出配置
const modeConfig = loadConfig();

// 导出工具函数
function getDebugWindowSize() {
  const height = modeConfig.DEBUG_WINDOW_HEIGHT;
  const width = Math.round(height * modeConfig.SCREEN_RATIO);
  return { width, height };
}

function getProductWindowSize() {
  return {
    width: modeConfig.SCREEN_WIDTH,
    height: modeConfig.SCREEN_HEIGHT
  };
}

module.exports = {
  modeConfig,
  getDebugWindowSize,
  getProductWindowSize
};

// 也可以导出为ES模块格式，以便在前端代码中使用
if (typeof module !== 'undefined') {
  module.exports = {
    modeConfig,
    getDebugWindowSize,
    getProductWindowSize
  };
} else {
  // 浏览器环境下的导出
  window.modeConfig = modeConfig;
  window.getDebugWindowSize = getDebugWindowSize;
  window.getProductWindowSize = getProductWindowSize;
}