import { useEffect, useState } from 'react';

/**
 * 本地存储封装
 * @param key 持久化键
 * @param defaultValue 默认值
 * @returns  [value, setValue, removeValue]
 */
function useStorage(key: string, defaultValue?: string): [string | undefined, (string) => void, () => void] {
    const [storedValue, setStoredValue] = useState(
        localStorage.getItem(key) || defaultValue
    );
    
    const setStorageValue = (value: string) => {
        localStorage.setItem(key, value);
        if (value !== storedValue) {
            setStoredValue(value);
        }
    };
    //  移除当前键值对方法
    const removeStorage = () => {
        localStorage.removeItem(key);
    };

    useEffect(() => {
        const storageValue = localStorage.getItem(key);
        if (storageValue) {
            setStoredValue(storageValue);
        }
    }, []);

    return [storedValue, setStorageValue, removeStorage];
}

export default useStorage;
