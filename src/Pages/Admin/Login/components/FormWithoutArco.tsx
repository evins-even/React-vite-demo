import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoading } from '../../../../common/components/LoadingContext';
import '../style/Form.less';

type Props = {};

type FormData = {
    userName: string;
    password: string;
};

export default function FormWithoutArco({ }: Props) {
    // const { showLoading, hideLoading } = useLoading();
    const [data, setData] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        setData(JSON.stringify(data));
    };

    return (
        <form className="FormContainer" onSubmit={handleSubmit(onSubmit)}>
            <div className="FormHeader">
                <h1 className="FormTitle">欢迎回来</h1>
                <p className="FormSubtitle">登录到 Even 的个人博客后台</p>
            </div>

            <div className="FormBody">
                <div className="userName FormItem">
                    <div className="FormItemWrapper">
                        <span className="FormLabel">用户名</span>
                        <div className="InputWrapper">
                            <span className="InputIcon">👤</span>
                            <input
                                placeholder="请输入用户名"
                                {...register('userName', {
                                    required: '用户名不能为空',
                                    minLength: {
                                        value: 2,
                                        message: '用户名至少2个字符',
                                    },
                                })}
                            />
                        </div>
                    </div>
                </div>
                {errors.userName && <span className="error-message">{errors.userName.message}</span>}

                <div className="password FormItem">
                    <div className="FormItemWrapper">
                        <span className="FormLabel">密码</span>
                        <div className="InputWrapper">
                            <span className="InputIcon">🔒</span>
                            <input
                                type="password"
                                placeholder="请输入密码"
                                {...register('password', {
                                    required: '请输入密码',
                                    minLength: {
                                        value: 6,
                                        message: '密码至少6个字符',
                                    },
                                })}
                            />
                        </div>
                    </div>
                </div>
                {errors.password && <span className="error-message">{errors.password.message}</span>}

                <div className="FormOptions">
                    <label className="RememberMe">
                        <input type="checkbox" />
                        <span>记住我</span>
                    </label>
                    <a href="#" className="ForgotPassword">忘记密码？</a>
                </div>

                <button type="submit" className="SubmitButton">
                    <span>登录</span>
                </button>
            </div>

            {data && <p className="DebugInfo">{data}</p>}
        </form>
    );
}