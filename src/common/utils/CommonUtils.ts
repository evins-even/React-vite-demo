// 策略执行器类
export class StrategyExecutor {
  private strategies: Record<string, (data: any) => any> = {};

  constructor(initialStrategies: Record<string, (data: any) => any> = {}) {
    // 初始化默认策略
    Object.assign(this.strategies, initialStrategies);
  }

  // 执行策略
  execute(strategyName: string, data: any) {
    if (!this.strategies[strategyName]) {
      throw new Error(`Strategy '${strategyName}' not found`);
    }
    return this.strategies[strategyName](data);
  }

  // 动态注册新策略
  registerStrategy(name: string, strategy: (data: any) => any) {
    this.strategies[name] = strategy;
  }

  // 获取所有可用策略
  getAvailableStrategies(): string[] {
    return Object.keys(this.strategies);
  }

  // 移除策略
  removeStrategy(name: string) {
    delete this.strategies[name];
  }
}

// 默认策略
const defaultStrategies = {
  isObject: (data: any): boolean => Object.prototype.toString.call(data) === "[object Object]",
  isArray: (data: any): boolean => Object.prototype.toString.call(data) === '[object Array]',
  isString: (data: any): boolean => Object.prototype.toString.call(data) === '[object String]',
  compare: (data: { a: string; b: string }) => data.a === data.b,
  divide: (data: { a: number; b: number }) => {
    if (data.b === 0) throw new Error("Division by zero");
    return data.a / data.b;
  },
};

// 创建默认实例
export const defaultStrategyExecutor = new StrategyExecutor(defaultStrategies);
