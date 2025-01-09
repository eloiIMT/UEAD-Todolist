import { Form, Input, Button } from 'antd';
import { useState } from 'react';
import { apiClient } from './api-client';
import { ITodoList } from './api-types';

interface ListFormProps {
  onListAdded?: (list: ITodoList) => void;
}

export const ListForm = ({ onListAdded }: ListFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { listName: string }) => {
    setLoading(true);
    try {
      const newList = await apiClient.addList(values.listName);
      form.resetFields();
      if (onListAdded) {
        onListAdded(newList);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la liste', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="inline"
    >
      <Form.Item
        name="listName"
        rules={[{ required: true, message: 'Please enter a list name' }]}
      >
        <Input placeholder="Enter list name" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create List
        </Button>
      </Form.Item>
    </Form>
  );
};
