// 策略对象 - 使用函数作为策略
const strategies = {
  add: (data: { a: number; b: number }) => data.a + data.b,
  multiply: (data: { a: number; b: number }) => data.a * data.b,
  subtract: (data: { a: number; b: number }) => data.a - data.b,
  divide: (data: { a: number; b: number }) => {
    if (data.b === 0) throw new Error("Division by zero");
    return data.a / data.b;
  },
};

// 策略执行器
export class StrategyExecutor {
  static execute(strategyName: string, data: any) {
    if (!strategies[strategyName]) {
      throw new Error(`Strategy '${strategyName}' not found`);
    }
    return strategies[strategyName](data);
  }

  // 动态注册新策略
  static registerStrategy(name: string, strategy: (data: any) => any) {
    strategies[name] = strategy;
  }

  // 获取所有可用策略
  static getAvailableStrategies(): string[] {
    return Object.keys(strategies);
  }
}

// 使用示例
console.log(StrategyExecutor.execute("add", { a: 5, b: 3 })); // 8
console.log(StrategyExecutor.execute("multiply", { a: 5, b: 3 })); // 15

// 动态添加新策略
StrategyExecutor.registerStrategy("power", (data: { a: number; b: number }) =>
  Math.pow(data.a, data.b)
);
console.log(StrategyExecutor.execute("power", { a: 2, b: 3 })); // 8

// 获取所有策略列表
console.log(StrategyExecutor.getAvailableStrategies()); // ['add', 'multiply', 'subtract', 'divide', 'power']
