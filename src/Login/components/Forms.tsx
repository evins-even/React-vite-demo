import React from 'react';
import { Form, Input, Checkbox, Button, Radio } from '@arco-design/web-react';
import "../style/LoginStyle.css"
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function Forms() {
  const [layout, setLayout] = React.useState<"horizontal" | "inline" | "vertical">('horizontal');
  return (
    <Form
      style={
        layout === 'inline'
          ? { width: '100%' }
          : { maxWidth: 900 }
      }
      autoComplete='off'
      layout={layout}
    >
      <FormItem label='Layout' >
        <RadioGroup onChange={setLayout} type='button' name='layout' value={layout}>
          <Radio value='horizontal'>horizontal</Radio>
          <Radio value='vertical'>vertical</Radio>
          <Radio value='inline'>inline</Radio> 
        </RadioGroup>
      </FormItem>
      <FormItem label='Username' field='username' tooltip={<div>Username is required </div>} rules={[{ required: true }]} className={'arco-demo-form-item-required'} style={{ columnGap: 20, flexWrap: "nowrap" }}>
        <Input style={{ width: 270 }} placeholder='please enter your name' />
      </FormItem>
      <FormItem label='Post'  style={{ columnGap: 20, flexWrap: "nowrap" }}>
        <Input style={{ width: 270 }} placeholder='please enter your post' />
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
