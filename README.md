# MagicWall

## 项目简介
MagicWall 是一个独立的 Windows 桌面应用程序，设计用于 13.57 米 × 1.8 米的物理展示屏幕。该应用允许用户通过点击按钮或热点区域切换页面，并在正常状态下展示循环滚动的动画效果。应用启动时会提示用户选择模式，以便适应不同的使用场景。无需安装浏览器，直接运行程序即可使用。

## 功能特点
- **独立应用**：Windows 平台原生应用，无需依赖浏览器
- **交互切换**：通过点击按钮或热点区域实现页面切换
- **动画效果**：页面上的小动画循环滚动播放
- **双模式支持**：
  - 调试模式：专为开发人员设计，用于开发调试和画面确定
  - 产品模式：针对 13.57m × 1.8m 大型屏幕优化的最终展示模式
- **响应式设计**：在不同尺寸的屏幕上都能提供良好的用户体验

## 技术栈
- 框架：Electron.js
- 前端：HTML, CSS, JavaScript
- 构建工具：Electron Builder

## 开发指南

### 环境设置
1. 克隆仓库：
   ```bash
   git clone [仓库地址]
   cd MagicWall
   ```
2. 安装依赖：
   ```bash
   npm install
   ```

### 启动应用
应用启动时会自动提示用户选择模式：
```bash
npm start
```

### 直接运行调试模式
开发人员可以直接运行调试模式进行开发和画面确定：
```bash
npm run dev
```

### 构建产品模式
构建适用于 Windows 的可执行文件：
```bash
npm run build
```

### 直接运行产品模式
无需选择界面，直接以产品模式运行：
```bash
npm run product
```

## 项目结构
```
MagicWall/
├── README.md           # 项目说明文档
├── package.json        # 项目依赖配置
├── src/
│   ├── index.html      # 入口文件
│   ├── css/
│   │   └── styles.css  # 样式文件
│   ├── js/
│   │   ├── app.js      # 应用主逻辑
│   │   ├── mode.js     # 模式切换逻辑
│   │   └── animation.js # 动画效果实现
│   └── assets/         # 静态资源（图片、视频等）
└── dist/               # 构建输出目录
```

## 配置说明
在 `src/js/mode.js` 中可以配置两种模式的参数：
- `DEBUG_MODE`: 是否启用调试模式
- `SCREEN_WIDTH`: 产品模式下的屏幕宽度（默认13570px，对应13.57米）
- `SCREEN_HEIGHT`: 产品模式下的屏幕高度（默认1800px，对应1.8米）

## 贡献指南
1.  Fork 本仓库
2.  创建特性分支：`git checkout -b feature/your-feature`
3.  提交更改：`git commit -m 'Add some feature'`
4.  推送到分支：`git push origin feature/your-feature`
5.  提交 Pull Request

## 许可证
[待确定，可根据实际需求添加许可证信息]

## 联系信息
如有问题或建议，请联系：[您的联系方式]