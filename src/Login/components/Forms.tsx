import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, Radio } from '@arco-design/web-react';
import "../style/LoginStyle.css"
import { useLogin } from '../hooks/useLogin';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function Forms() {
  const [layout, setLayout] = useState<"horizontal" | "inline" | "vertical">('horizontal');
  const [userName, setUserName] = useState("")
  const [form] = Form.useForm<{ email: string, password: string }>();
  const FormUtils = useLogin()

  return (
    <Form
      form={form}
      style={
        layout === 'inline'
          ? { width: '100%' }
          : { maxWidth: 900 }
      }
      autoComplete='off'
      layout={layout}
      onValuesChange={(value, vas) => {
        //两个参数，第一个是当前变化的值， 第二个是所有值
        console.log(value, vas)
      }}
      onSubmit={(value) => {
        console.log(value)
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
      <FormItem label='email' field='email' tooltip={<div>Username is required </div>} rules={[{ required: true }]} className={'arco-demo-form-item-required'} style={{ columnGap: 20, flexWrap: "nowrap" }}>
        <Input style={{ width: 270 }} placeholder='please enter your name' />
      </FormItem>
      <FormItem label='PassWord' field="password" style={{ columnGap: 20, flexWrap: "nowrap" }} rules={[{ required: true, message: 'Password is required', maxLength: 12, }]} className={'arco-demo-form-item-required'}>
        <Input style={{ width: 270 }} placeholder='please enter your post' type='password' />
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
          Submit
        </Button>
      </FormItem>
    </Form>
  );
}

export default Forms;
