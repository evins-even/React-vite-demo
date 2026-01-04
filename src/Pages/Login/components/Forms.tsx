import { useState } from 'react';
import Form from "@arco-design/web-react/es/Form"
import Input from "@arco-design/web-react/es/Input"
import Checkbox from "@arco-design/web-react/es/Checkbox"
import Button from "@arco-design/web-react/es/Button"
import Radio from "@arco-design/web-react/es/Radio"
import "../style/loginStyle.less"
import { useLogin } from '../hooks/useLogin';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
export type LayoutType = "horizontal" | "inline" | "vertical";


function Forms() {
  const [layout, setLayout] = useState<LayoutType>('horizontal');
  const [form] = Form.useForm<{ email: string, password: string }>();
  const FormUtils = useLogin()

  return (
    <Form
      form={form}
      style={{
        ...{
          border: '1px solid black',
          width: '100%',
        }
      }}
      autoComplete='off'
      layout={layout}
      onValuesChange={(value, vas) => {
        //两个参数，第一个是当前变化的值， 第二个是所有值
      }}
      onSubmit={(value) => {
        FormUtils.login(value)
      }}
    >
      <FormItem label='Layout' >
        <RadioGroup onChange={setLayout} type='button' name='layout' value={layout}>
          <Radio value='horizontal'>horizontal</Radio>
          <Radio value='vertical'>vertical</Radio>
          <Radio value='inline'>inline</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label='userName' field='userName' tooltip={<div>Username is required </div>} rules={[{ required: true }]} className={'FormItem'} >
        <Input className="Input" placeholder='please enter your name' />
      </FormItem>
      <FormItem label='PassWord' field="password" rules={[{ required: true, message: 'Password is required', maxLength: 12, }]} className={'arco-demo-form-item-required'}>
        <Input className="Input" placeholder='please enter your post' type='password' />
      </FormItem>
      <FormItem
        label='Agree'
        field="agree"
        rules={[{ required: true, message: 'Please agree to the terms of service', }]}
      >
        <Checkbox>I have read the manual</Checkbox>
      </FormItem>
      <FormItem
        wrapperCol={
          layout === 'horizontal'
            ? {
              offset: 5,
            }
            : {}
        }
      >
        <Button type='primary' htmlType='submit'>
          Login
        </Button>
      </FormItem>
    </Form>
  );
}

export default Forms;
