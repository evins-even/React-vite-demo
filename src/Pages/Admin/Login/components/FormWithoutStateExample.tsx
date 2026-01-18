import React, { useRef } from 'react';
import FormWithoutState, { FormWithoutStateRef } from './FormWithoutState';

/**
 * 使用示例：展示如何通过 ref 操作表单
 */
export default function FormWithoutStateExample() {
    const formRef = useRef<FormWithoutStateRef>(null);

    // 通过 ref 提交表单
    const handleRefSubmit = async () => {
        if (!formRef.current) return;

        try {
            const data = await formRef.current.submit();
            console.log('通过 ref 提交成功:', data);
            alert(`提交成功！\n用户名: ${data.userName}`);
        } catch (error) {
            console.error('提交失败:', error);
            alert('表单验证失败，请检查输入');
        }
    };

    // 通过 ref 验证表单
    const handleValidate = async () => {
        if (!formRef.current) return;

        const isValid = await formRef.current.validate();
        if (isValid) {
            alert('✅ 表单验证通过');
        } else {
            alert('❌ 表单验证失败');
        }
    };

    // 通过 ref 重置表单
    const handleReset = () => {
        if (!formRef.current) return;
        formRef.current.reset();
        alert('表单已重置');
    };

    // 通过 ref 获取表单数据
    const handleGetValues = () => {
        if (!formRef.current) return;
        const values = formRef.current.getValues();
        console.log('当前表单数据:', values);
        alert(`当前表单数据:\n用户名: ${values.userName}\n密码: ${values.password ? '***' : '(空)'}`);
    };

    // 通过 ref 设置表单数据
    const handleSetValues = () => {
        if (!formRef.current) return;
        /*   formRef.current.setValues({
              userName: 'testUser',
              password: '123456',
          }); */
        alert('已设置表单数据');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            padding: '20px'
        }}>
            {/* 表单组件 */}
            <FormWithoutState ref={formRef} />

            {/* 外部控制按钮 */}
            <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                <button onClick={handleRefSubmit} style={buttonStyle}>
                    通过 ref 提交
                </button>
                <button onClick={handleValidate} style={buttonStyle}>
                    验证表单
                </button>
                <button onClick={handleReset} style={buttonStyle}>
                    重置表单
                </button>
                <button onClick={handleGetValues} style={buttonStyle}>
                    获取表单数据
                </button>
                <button onClick={handleSetValues} style={buttonStyle}>
                    设置表单数据
                </button>
            </div>

            <div style={{
                padding: '16px',
                background: '#f0f0f0',
                borderRadius: '8px',
                maxWidth: '600px',
            }}>
                <h3 style={{ marginTop: 0 }}>使用说明：</h3>
                <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
                    <li><strong>实时校验：</strong>输入时会立即验证，显示错误信息</li>
                    <li><strong>提交按钮禁用：</strong>表单无效或正在提交时，按钮自动禁用</li>
                    <li><strong>通过 ref 操作：</strong>可以调用表单的 submit、validate、reset 等方法</li>
                    <li><strong>表单内提交：</strong>点击表单内的提交按钮可以正常提交</li>
                    <li><strong>外部提交：</strong>点击"通过 ref 提交"按钮也可以提交表单</li>
                </ul>
            </div>
        </div>
    );
}

const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '14px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
};

