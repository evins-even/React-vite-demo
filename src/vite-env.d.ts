/// <reference types="vite/client" />

// Vite 内置环境变量类型定义
interface ImportMetaEnv {
  // 自定义环境变量（以 VITE_ 开头）
  readonly VITE_API_BASE_URL?: string;
  
  // 可以添加更多自定义环境变量
  // readonly VITE_APP_TITLE?: string;
  // readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv & {
    // Vite 内置环境变量
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly SSR: boolean;
  };
}

