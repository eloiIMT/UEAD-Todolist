import { Button, Layout, List, Menu, MenuProps } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { apiClient } from "./api-client";
import { useEffect, useState } from "react";
import { ListForm } from "./ListForm";
import { TodoForm } from "./TodoForm";
import { ITodoList } from './api-types';
import { Def0, Def1 } from "todo-list-client";
import { Console } from "console";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export default function App() {
  // TODO use correct types instead of any
  const [lists, setLists] = useState<ITodoList[]>([]);
  const [selectedList, setSelectedList] = useState<any | null>(null);
  const [showListForm, setShowListForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [selectedListItems, setSelectedListItems] = useState<Def1[]>([]);

  useEffect(() => {
    apiClient.getLists().then(setLists);
  }, []);

  useEffect(() => {
    if (selectedList) {
      apiClient.getTodos(selectedList).then(setSelectedListItems);
    }
  }, [selectedList]);

  const handleItemClick = (key: string) => {
    if (key === 'add') {
      setSelectedList(null);
      setShowListForm(true);
    } else {
      setSelectedList(key);
    }
  }

  const items: MenuItem[] = lists.map((list: ITodoList) => ({
    key: list.id,
    label: list.name
  }));

  function handleListAdded(newList: ITodoList): void {
    setLists([...lists, newList]);
    setShowListForm(false);
  }

  function handleTodoAdded(todo: string): void {
    if (selectedList) {
      console.log('selectedList', selectedList);
      apiClient.addTodo(selectedList, todo).then(newItems => {
        setSelectedListItems([...selectedListItems, newItems]);
      });
    }
    setShowTodoForm(false);
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          TODO LISTS
      </Header>
      <Layout>
        <Sider width={200} style={{ background: 'black' }}>
          <Menu
            theme="dark"
            mode="inline"
            items={[{key: 'add', label: 'Add list', icon: <PlusOutlined />}, ...items]}
            onClick={(e) => handleItemClick(e.key)}
          />
        </Sider>
        <Content
          style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          }}    
        >
          {showListForm && <ListForm onListAdded={handleListAdded} />}
          {selectedList && 
            <div>
              <Button onClick={() => setShowTodoForm(true)}>Add Todo</Button>
              <List
                dataSource={selectedListItems}
                renderItem={(item: Def1) => (
                  <List.Item>
                    {item.description}
                  </List.Item>
                )}
              />
            </div>
          }
          {!selectedList && !showListForm && <div>Select a list</div>}    
          {showTodoForm && <TodoForm onTodoAdded={handleTodoAdded} />}
        </Content>
      </Layout>
    </Layout>
  )
}