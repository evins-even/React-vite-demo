import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import '../style/Form.less';

type Props = {};

export type FormData = {
    userName: string;
    password: string;
};

export interface FormWithoutStateRef {
    submit: () => Promise<FormData>;
    validate: () => boolean;
    reset: () => void;
    getValues: () => FormData;
}

// 校验函数
const validateField = (name: keyof FormData, value: string): string | undefined => {
    if (name === 'userName') {
        if (!value) return '用户名不能为空';
        if (value.length < 2) return '用户名至少2个字符';
        if (/\s/.test(value)) return '用户名不能包含空格';
    }
    if (name === 'password') {
        if (!value) return '密码不能为空';
        if (value.length < 6) return '密码至少6个字符';
        if (!/\d/.test(value)) return '密码必须包含至少一个数字';
    }
    return undefined;
};

const FormWithoutState = forwardRef<FormWithoutStateRef, Props>((_props, ref) => {
    const userNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // 只存储错误信息，不存储表单数据
    const [errors, setErrors] = useState<{ userName?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 获取表单数据（实时从 DOM 读取）
    const getValues = (): FormData => ({
        userName: userNameRef.current?.value || '',
        password: passwordRef.current?.value || '',
    });

    // 校验单个字段（只有失败时才更新 state）
    const handleInput = (name: keyof FormData) => () => {
        const input = name === 'userName' ? userNameRef.current : passwordRef.current;
        if (!input) return;

        const error = validateField(name, input.value);
        // 只有错误变化时才更新 state
        setErrors(prev => {
            if (prev[name] === error) return prev; // 错误没变化，不更新
            return { ...prev, [name]: error };
        });
    };

    // 校验整个表单
    const validate = (): boolean => {
        const values = getValues();
        const newErrors: typeof errors = {};

        const userNameError = validateField('userName', values.userName);
        const passwordError = validateField('password', values.password);

        if (userNameError) newErrors.userName = userNameError;
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const data = getValues();
            console.log('提交表单数据:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
            setIsSubmitting(false);
        }
    };

    // 暴露 ref 方法
    useImperativeHandle(ref, () => ({
        submit: async () => {
            if (!validate()) throw new Error('表单验证失败');
            setIsSubmitting(true);
            try {
                const data = getValues();
                await new Promise(resolve => setTimeout(resolve, 1000));
                return data;
            } finally {
                setIsSubmitting(false);
            }
        },
        validate,
        reset: () => {
            if (userNameRef.current) userNameRef.current.value = '';
            if (passwordRef.current) passwordRef.current.value = '';
            setErrors({});
        },
        getValues,
    }));

    // 按钮禁用状态：有错误或正在提交时禁用
    const isSubmitDisabled = !!errors.userName || !!errors.password || isSubmitting;

    return (
        <form className="FormContainer" onSubmit={handleSubmit}>
            <div className="FormHeader">
                <h1 className="FormTitle">登录表单</h1>
                <p className="FormSubtitle">非受控组件，最简实现</p>
            </div>

            <div className="FormBody">
                <div className="userName FormItem">
                    <div className="FormItemWrapper">
                        <span className="FormLabel">用户名</span>
                        <div className="InputWrapper">
                            <span className="InputIcon">👤</span>
                            <input
                                ref={userNameRef}
                                type="text"
                                placeholder="请输入用户名"
                                onInput={handleInput('userName')}
                            />
                        </div>
                    </div>
                    {errors.userName && (
                        <span className="error-message">{errors.userName}</span>
                    )}
                </div>

                <div className="password FormItem">
                    <div className="FormItemWrapper">
                        <span className="FormLabel">密码</span>
                        <div className="InputWrapper">
                            <span className="InputIcon">🔒</span>
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="请输入密码"
                                onInput={handleInput('password')}
                            />
                        </div>
                    </div>
                    {errors.password && (
                        <span className="error-message">{errors.password}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="SubmitButton"
                    disabled={isSubmitDisabled}
                    style={{
                        opacity: isSubmitDisabled ? 0.6 : 1,
                        cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isSubmitting ? '提交中...' : '提交'}
                </button>
            </div>
        </form>
    );
});

FormWithoutState.displayName = 'FormWithoutState';

export default FormWithoutState;

