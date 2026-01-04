export const plugins = {
    'postcss-pxtorem': {
        rootValue: 16, // 设计稿的根字体大小，通常为16px或根据设计稿决定
        unitPrecision: 5, // 保留几位小数
        propList: ['*'], // 需要转换的属性，*表示所有
        selectorBlackList: [], // 忽略转换的选择器
        replace: true, // 直接替换而不是追加
        mediaQuery: false, // 媒体查询中的px不转换
        minPixelValue: 1 // 最小转换数值
    }
};
requjuire('postcss-pxtorem')