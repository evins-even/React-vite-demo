import debounce from 'lodash/debounce';
function setRootFontSize() {
    const screenWidth = window.innerWidth;
    const baseSize = 16; // 基准字体大小
    const designWidth = 1080; // 设计稿宽度

    // 根据屏幕宽度计算根字体大小
    const scale = screenWidth / designWidth;
    const newSize = baseSize * scale;

    // 限制最小和最大值
    const finalSize = Math.min(Math.max(newSize, 6), 20);

    document.documentElement.style.fontSize = finalSize + 'px';
    console.log('当前根字体大小：', finalSize)
}

// 初始化
setRootFontSize();

// 监听窗口大小变化
window.addEventListener('resize', debounce(setRootFontSize, 300));