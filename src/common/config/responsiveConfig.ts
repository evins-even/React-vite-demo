/**
 * 响应式配置文件
 * 根据不同的使用场景，可以选择不同的配置方案
 */

export interface ResponsiveConfig {
  baseSize: number;      // 基准字体大小（需与 postcss rootValue 一致）
  designWidth: number;   // 设计稿宽度
  minSize: number;       // 最小字体大小
  maxSize: number;       // 最大字体大小
  debounceTime: number;  // 防抖时间
}

/**
 * 预设配置方案
 */
export const presetConfigs = {
  // PC 端（大屏优先）
  desktop: {
    baseSize: 100,
    designWidth: 1920,
    minSize: 50,
    maxSize: 200,
    debounceTime: 300,
  } as ResponsiveConfig,

  // 移动端（小屏优先）
  mobile: {
    baseSize: 100,
    designWidth: 375,
    minSize: 20,
    maxSize: 100,
    debounceTime: 300,
  } as ResponsiveConfig,

  // 平板端（中屏优先）
  tablet: {
    baseSize: 100,
    designWidth: 768,
    minSize: 30,
    maxSize: 150,
    debounceTime: 300,
  } as ResponsiveConfig,

  // 响应式（自适应所有设备）
  responsive: {
    baseSize: 100,
    designWidth: 1920,
    minSize: 20,
    maxSize: 200,
    debounceTime: 300,
  } as ResponsiveConfig,
};

/**
 * 当前使用的配置（可根据需要切换）
 */
export const currentConfig: ResponsiveConfig = presetConfigs.responsive;

/**
 * 断点配置（用于媒体查询）
 */
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1920,
} as const;

/**
 * 根据屏幕宽度获取设备类型
 */
export function getDeviceType(width: number): keyof typeof breakpoints {
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
}

