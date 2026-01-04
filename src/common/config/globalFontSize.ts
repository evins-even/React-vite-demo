import debounce from 'lodash/debounce';
import { currentConfig, getDeviceType } from './responsiveConfig';

/**
 * 响应式设置根字体大小
 * 配合 postcss-pxtorem 的 rootValue: 100 使用
 * 
 * 计算逻辑：
 * - 基准字体：100px（与 vite.config.js 中的 rootValue 保持一致）
 * - 实际字体 = 100 * (当前屏幕宽度 / 设计稿宽度)
 * 
 * 例如：设计稿 1920px，屏幕 1920px 时，根字体 = 100px
 *      设计稿 1920px，屏幕 960px 时，根字体 = 50px
 * 
 * 使用示例：
 * 在 CSS 中写 width: 200px，会自动转换为 width: 2rem
 * 当屏幕宽度为 1920px 时，实际显示为 200px
 * 当屏幕宽度为 960px 时，实际显示为 100px（等比缩放）
 */
function setRootFontSize() {
    const screenWidth = window.innerWidth;
    const { baseSize, designWidth, minSize, maxSize } = currentConfig;

    // 根据屏幕宽度计算根字体大小
    const scale = screenWidth / designWidth;
    const newSize = baseSize * scale;

    // 限制最小和最大值，避免极端情况
    const finalSize = Math.min(Math.max(newSize, minSize), maxSize);

    // 设置根字体大小
    document.documentElement.style.fontSize = finalSize + 'px';
    
    // 添加设备类型的 class，方便 CSS 针对不同设备做特殊处理
    const deviceType = getDeviceType(screenWidth);
    document.documentElement.setAttribute('data-device', deviceType);
    
    // 开发环境下输出日志
    if (process.env.NODE_ENV === 'development') {
        console.log(
            `📐 响应式字体大小：${finalSize.toFixed(2)}px\n` +
            `   屏幕宽度: ${screenWidth}px\n` +
            `   设备类型: ${deviceType}\n` +
            `   缩放比例: ${scale.toFixed(4)}`
        );
    }
}

// 初始化
setRootFontSize();

// 监听窗口大小变化（防抖）
const debouncedSetRootFontSize = debounce(setRootFontSize, currentConfig.debounceTime);
window.addEventListener('resize', debouncedSetRootFontSize);

// 监听屏幕方向变化（移动端）
window.addEventListener('orientationchange', debouncedSetRootFontSize);

// 页面可见性变化时重新计算（处理浏览器缩放等情况）
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        setRootFontSize();
    }
});

export default setRootFontSize;