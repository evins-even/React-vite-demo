//Promise重试函数
function retryPromise<T>(fn: (...args: any[]) => Promise<T>, baseDelay: number = 1000, maxRetries: number = 3) {
    if (typeof fn !== "function") {
        throw new Error('Expected a function that returns a promise')
    }
    if (baseDelay < 0) throw new Error('Delay must be a non-negative number');
    if (maxRetries < 0) throw new Error('Max retries must be a non-negative number');

    let isCancelled = false
    return function (...args: any[]) {
        let retries = 0
        function execute() {
            // 检查是否已被取消
            if (isCancelled) {
                return Promise.reject(new Error('Retry operation was cancelled.'));
            }
            return fn(...args)
                .catch((error) => {
                    retries++
                    console.log(`Attempt ${retries} failed:`, error.message)
                    if (isCancelled || retries >= maxRetries) {
                        console.log('Max retries reached');
                        throw error;
                    }
                    // 指数退避计算：延迟 = 基础延迟 * (2的 (重试次数-1) 次方)
                    const delay = baseDelay * Math.pow(2, retries - 1);
                    // （可选）添加随机抖动，避免同步重试
                    const jitter = delay * 0.1 * Math.random(); // ±10% 的抖动
                    const actualDelay = delay + jitter;
                    console.log(`Waiting ${actualDelay}ms before retry...`);

                    return new Promise((resolve, reject) => {
                        const timerId = setTimeout(() => resolve(execute()), actualDelay);
                        // 在等待期间如果取消，则清除定时器
                        if (isCancelled) {
                            clearTimeout(timerId);
                            reject(new Error('Retry operation was cancelled.'));
                        }
                    });
                })
        }
        return {
            execute,
            cancel: () => {
                isCancelled = true;
                console.log('Cancellation requested.');
            }
        }
    }
}

//“为什么要用递归而不是 for 循环？”
/* 答：首先，如果不使用async/await进行异步化处理的话，使用for循环实质上并不能实现我们错误重试的目的，因为for循环是同步的，实质上它会同时
    发起所有请求，而不是进行 执行-》等待-》再次请求-》等待 的循环。而使用递归更能体现这个过程，并且天然的形成了一个异步链。
    当然，我们可以使用for循环配合async/await 实现这一目的。下面我给出js简单回答：
*/
function retryWithLoop(fn, maxRetries = 3, delay = 1000) {
    // 返回一个可以接收参数的函数
    return async function (...args) {
        let lastError;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await fn(...args);
            } catch (error) {
                lastError = error;
                if (attempt < maxRetries - 1) { // 如果不是最后一次尝试，则等待
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw lastError;
    };
}
