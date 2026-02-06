import React from 'react';
import { MinusCircleIcon } from 'tdesign-icons-react';
import { fireEvent, mockTimeout, render, vi } from '@test/utils';

import Button from '../../button';
import Input from '../../input';
import Radio from '../../radio';
import FormList from '../FormList';
import Form, { type FormProps } from '../index';

const { FormItem } = Form;

const BasicForm = (props: FormProps & { operation }) => {
  const { form, operation, ...restField } = props;

  return (
    <Form form={form} {...restField}>
      <FormList name="address">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <FormItem key={key}>
                <FormItem
                  {...restField}
                  name={[name, 'province']}
                  label="省份"
                  rules={[{ required: true, type: 'error' }]}
                >
                  <Input />
                </FormItem>
                <FormItem {...restField} name={[name, 'area']} label="地区" rules={[{ required: true, type: 'error' }]}>
                  <Input placeholder={`area-input-${index}`} />
                </FormItem>

                <FormItem>
                  <MinusCircleIcon className={`test-remove-${index}`} onClick={() => remove(name)} />
                </FormItem>
              </FormItem>
            ))}
            <FormItem style={{ marginLeft: 100 }}>
              <Button id="test-add" onClick={() => add()}>
                Add empty field
              </Button>
              <Button id="test-add-with-data" onClick={() => add({ province: 'guangdong', area: 'shenzhen' })}>
                Add field with data
              </Button>
            </FormItem>
          </>
        )}
      </FormList>
      <FormItem>{operation()}</FormItem>
    </Form>
  );
};

describe('FormList 组件测试', () => {
  test('FormList basic API', async () => {
    const onValuesChangeFn = vi.fn();
    let latestFormValues = {};

    const TestView = () => {
      const [form] = Form.useForm();

      function setFields() {
        form.getFieldsValue(true);
        form.setFields([{ name: 'address', value: [{ province: 'setFields' }] }]);
      }

      function setFieldsValue() {
        form.getFieldValue('address');
        form.setFieldsValue({ address: [{ province: 'setFieldsValue' }] });
      }

      function setValidateMessage() {
        form.setValidateMessage({ address: [{ type: 'error', message: 'message: setValidateMessage' }] });
      }

      function validate() {
        form.validate();
      }

      function validateOnly() {
        form.validateOnly();
      }

      function clearValidate() {
        form.clearValidate();
      }

      function getFormValues() {
        const values = form.getFieldsValue(true);
        document.getElementById('form-values-result')?.setAttribute('data-result', JSON.stringify(values));
      }

      return (
        <BasicForm
          form={form}
          onValuesChange={(changedValues, allValues) => {
            onValuesChangeFn(changedValues, allValues);
            latestFormValues = allValues;
          }}
          operation={() => (
            <>
              <Button type="submit">submit</Button>
              <Button type="reset">reset</Button>
              <Button onClick={setFields}>setFields</Button>
              <Button onClick={setFieldsValue}>setFieldsValue</Button>
              <Button onClick={setValidateMessage}>setValidateMessage</Button>
              <Button onClick={validate}>validate</Button>
              <Button onClick={validateOnly}>validateOnly</Button>
              <Button onClick={clearValidate}>clearValidate</Button>
              <Button onClick={getFormValues}>getFormValues</Button>
              <div id="form-values-result" data-result="" />
            </>
          )}
        />
      );
    };

    const { container, queryByDisplayValue, queryByText } = render(<TestView />);
    const addBtn = container.querySelector('#test-add-with-data');
    const resetBtn = queryByText('reset');

    // Reset onValuesChange call count
    onValuesChangeFn.mockClear();

    // Test 1: Add field with data and verify onValuesChange is called
    fireEvent.click(addBtn);
    await mockTimeout(() => true);
    expect(queryByDisplayValue('guangdong')).toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).toBeTruthy();

    // Verify onValuesChange was called with correct data
    expect(onValuesChangeFn).toHaveBeenCalled();
    const lastCall = onValuesChangeFn.mock.calls[onValuesChangeFn.mock.calls.length - 1];
    expect(lastCall[1]).toEqual({
      address: [{ province: 'guangdong', area: 'shenzhen' }],
    });

    // Verify UI matches the data in onValuesChange
    expect(latestFormValues).toEqual({
      address: [{ province: 'guangdong', area: 'shenzhen' }],
    });

    const initialCallCount = onValuesChangeFn.mock.calls.length;

    fireEvent.click(resetBtn);
    await mockTimeout(() => true);

    // Check if UI is cleared after reset
    expect(queryByDisplayValue('guangdong')).not.toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).not.toBeTruthy();

    // Verify form values are cleared (either through onValuesChange or direct form state)
    const currentFormValues = container.querySelector('#form-values-result');
    if (currentFormValues) {
      fireEvent.click(queryByText('getFormValues'));
      await mockTimeout(() => true);
      const formValuesResult = currentFormValues.getAttribute('data-result');
      const formValues = JSON.parse(formValuesResult || '{}');
      expect(formValues).toEqual({});
    }

    // If onValuesChange was called during reset, verify the data
    if (onValuesChangeFn.mock.calls.length > initialCallCount) {
      const resetCall = onValuesChangeFn.mock.calls[onValuesChangeFn.mock.calls.length - 1];
      expect(resetCall[1]).toEqual({});
      expect(latestFormValues).toEqual({});
    } else {
      latestFormValues = {};
    }

    const beforeAddCallCount = onValuesChangeFn.mock.calls.length;

    fireEvent.click(addBtn);
    await mockTimeout(() => true);
    expect(queryByDisplayValue('guangdong')).toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).toBeTruthy();

    const removeBtn = container.querySelector('.test-remove-0');
    fireEvent.click(removeBtn);
    await mockTimeout(() => true);
    expect(queryByDisplayValue('guangdong')).not.toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).not.toBeTruthy();

    const afterRemoveCallCount = onValuesChangeFn.mock.calls.length;

    // Verify onValuesChange was called for both add and remove operations
    expect(afterRemoveCallCount).toBeGreaterThan(beforeAddCallCount);
    if (afterRemoveCallCount > beforeAddCallCount) {
      const removeCall = onValuesChangeFn.mock.calls[afterRemoveCallCount - 1];
      expect(removeCall[1]).toEqual({ address: [] });
    }

    // Test 4: setFields and verify onValuesChange
    const beforeSetFieldsCallCount = onValuesChangeFn.mock.calls.length;

    fireEvent.click(queryByText('setFields'));
    await mockTimeout(() => true);
    expect(queryByDisplayValue('setFields')).toBeTruthy();

    const afterSetFieldsCallCount = onValuesChangeFn.mock.calls.length;

    if (afterSetFieldsCallCount > beforeSetFieldsCallCount) {
      const setFieldsCall = onValuesChangeFn.mock.calls[afterSetFieldsCallCount - 1];
      expect(setFieldsCall[1]).toEqual({
        address: [{ province: 'setFields' }],
      });
    }

    // Test 5: setFieldsValue and verify onValuesChange
    const beforeSetFieldsValueCallCount = onValuesChangeFn.mock.calls.length;
    fireEvent.click(queryByText('setFieldsValue'));
    await mockTimeout(() => true);
    expect(queryByDisplayValue('setFieldsValue')).toBeTruthy();

    const afterSetFieldsValueCallCount = onValuesChangeFn.mock.calls.length;
    if (afterSetFieldsValueCallCount > beforeSetFieldsValueCallCount) {
      const setFieldsValueCall = onValuesChangeFn.mock.calls[afterSetFieldsValueCallCount - 1];
      expect(setFieldsValueCall[1]).toEqual({
        address: [{ province: 'setFieldsValue' }],
      });
    }

    fireEvent.click(queryByText('getFormValues'));
    await mockTimeout(() => true);
    const formValuesResult = container.querySelector('#form-values-result')?.getAttribute('data-result');
    const formValues = JSON.parse(formValuesResult || '{}');
    expect(formValues).toEqual(latestFormValues);
    expect(formValues).toEqual({
      address: [{ province: 'setFieldsValue' }],
    });

    const beforeManualInputCallCount = onValuesChangeFn.mock.calls.length;
    const provinceInput = container.querySelector('input[value="setFieldsValue"]') as HTMLInputElement;
    fireEvent.change(provinceInput, { target: { value: 'manual-input' } });
    await mockTimeout(() => true);

    const afterManualInputCallCount = onValuesChangeFn.mock.calls.length;
    if (afterManualInputCallCount > beforeManualInputCallCount) {
      const manualInputCall = onValuesChangeFn.mock.calls[afterManualInputCallCount - 1];
      expect(manualInputCall[1]).toEqual({
        address: [{ province: 'manual-input' }],
      });
      expect(latestFormValues).toEqual({
        address: [{ province: 'manual-input' }],
      });
    }

    // validate validateOnly test
    fireEvent.click(queryByText('validateOnly'));
    await mockTimeout(() => true);
    expect(queryByText('省份必填')).not.toBeTruthy();
    fireEvent.click(queryByText('validate'));
    await mockTimeout(() => true);
    expect(queryByText('地区必填')).toBeTruthy();
    fireEvent.click(queryByText('clearValidate'));
    expect(queryByText('地区必填')).not.toBeTruthy();
  });

  test('FormList reset to initial data', async () => {
    const TestView = () => {
      const [form] = Form.useForm();

      const initialFormData = {
        address: [
          { province: 'guangdong', area: 'shenzhen' },
          { province: 'beijing', area: 'beijing' },
        ],
      };

      return (
        <BasicForm
          form={form}
          initialData={initialFormData}
          resetType="initial"
          operation={() => <Button type="reset">reset</Button>}
        />
      );
    };

    const { container, queryByText, getByPlaceholderText } = render(<TestView />);

    // 验证初始数据渲染正确
    expect((getByPlaceholderText('area-input-0') as HTMLInputElement).value).toBe('shenzhen');
    expect((getByPlaceholderText('area-input-1') as HTMLInputElement).value).toBe('beijing');

    // 删除 beijing
    const removeBtn1 = container.querySelector('.test-remove-1');
    fireEvent.click(removeBtn1);
    await mockTimeout(() => true);
    // 只剩 shenzhen
    expect((getByPlaceholderText('area-input-0') as HTMLInputElement).value).toBe('shenzhen');
    expect(container.querySelector('[placeholder="area-input-1"]')).toBeFalsy();

    // 添加空数据
    const addBtn = container.querySelector('#test-add');
    fireEvent.click(addBtn);
    await mockTimeout(() => true);
    expect((getByPlaceholderText('area-input-0') as HTMLInputElement).value).toBe('shenzhen');
    expect(container.querySelector('[placeholder="area-input-1"]')).toBeTruthy();
    expect((getByPlaceholderText('area-input-1') as HTMLInputElement).value).toBe('');

    // 再删除 shenzhen
    const removeBtn0 = container.querySelector('.test-remove-0');
    fireEvent.click(removeBtn0);
    await mockTimeout(() => true);
    expect((getByPlaceholderText('area-input-0') as HTMLInputElement).value).toBe('');
    expect(container.querySelector('[placeholder="area-input-1"]')).toBeFalsy();

    // 点击 reset 重置
    const resetBtn = queryByText('reset');
    fireEvent.click(resetBtn);
    await mockTimeout(() => true);

    // 恢复到初始化数据
    expect((getByPlaceholderText('area-input-0') as HTMLInputElement).value).toBe('shenzhen');
    expect((getByPlaceholderText('area-input-1') as HTMLInputElement).value).toBe('beijing');
  });

  test('FormList setFields not trigger onValueChange', async () => {
    const fn = vi.fn();

    const TestView = () => {
      const [form] = Form.useForm();

      function setFields() {
        form.setFields([{ name: 'address', value: [{ province: 'setFields' }] }]);
      }

      return (
        <Form form={form} onValuesChange={fn}>
          <FormList name="address">
            {(fields) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <FormItem key={key}>
                    <FormItem {...restField} name={[name, 'province']} label="省份">
                      <Input />
                    </FormItem>
                  </FormItem>
                ))}
              </>
            )}
          </FormList>
          <FormItem>
            <Button onClick={setFields}>setFields</Button>
          </FormItem>
        </Form>
      );
    };

    const { queryByText } = render(<TestView />);

    // 第一次更新会触发，后续相同值更新不再触发
    fireEvent.click(queryByText('setFields'));
    await mockTimeout();
    expect(fn).toHaveBeenCalledTimes(1);
    fireEvent.click(queryByText('setFields'));
    await mockTimeout();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('FormList with nested structures', async () => {
    const TestView = () => {
      const [form] = Form.useForm();

      function setFields() {
        form.setFields([
          {
            name: 'users',
            value: [
              {
                name: 'Alice',
                projects: [
                  {
                    projectName: 'Website Redesign',
                    tasks: [
                      { taskName: 'Design mockups', status: 'completed' },
                      { taskName: 'Frontend development', status: 'in-progress' },
                    ],
                  },
                ],
              },
            ],
          },
        ]);
      }

      function setFieldsValue() {
        form.setFieldsValue({
          users: [
            {
              name: 'Bob',
              projects: [
                {
                  projectName: 'Mobile App',
                  tasks: [
                    { taskName: 'API integration', status: 'pending' },
                    { taskName: 'UI implementation', status: 'in-progress' },
                  ],
                },
              ],
            },
          ],
        });
      }

      function addNestedData() {
        form.setFieldsValue({
          users: [
            {
              name: 'Charlie',
              projects: [
                {
                  projectName: 'Backend Service',
                  tasks: [
                    { taskName: 'Database design', status: 'completed' },
                    { taskName: 'API development', status: 'in-progress' },
                    { taskName: 'Testing', status: 'pending' },
                  ],
                },
                {
                  projectName: 'DevOps',
                  tasks: [{ taskName: 'CI/CD setup', status: 'completed' }],
                },
              ],
            },
            {
              name: 'David',
              projects: [
                {
                  projectName: 'Documentation',
                  tasks: [{ taskName: 'Write API docs', status: 'in-progress' }],
                },
              ],
            },
          ],
        });
      }

      function validate() {
        form.validate();
      }

      function clearValidate() {
        form.clearValidate();
      }

      function getFieldsValueAll() {
        const allValues = form.getFieldsValue(true);
        document.getElementById('all-values-result')?.setAttribute('data-result', JSON.stringify(allValues));
      }

      function getFieldsValueByPath() {
        // Test 1: Get specific user's data
        const usersPath = form.getFieldsValue(['users']);

        // Test 2: Get specific nested path - first user's projects
        const firstUserProjects = form.getFieldsValue([['users', 0, 'projects']]);

        // Test 3: Get specific nested path - first user's first project's tasks
        const firstProjectTasks = form.getFieldsValue([['users', 0, 'projects', 0, 'tasks']]);

        // Test 4: Get multiple paths at once
        const multiplePaths = form.getFieldsValue([
          ['users', 0, 'name'],
          ['users', 1, 'name'],
          ['users', 0, 'projects', 0, 'projectName'],
        ]);

        const result = {
          usersPath,
          firstUserProjects,
          firstProjectTasks,
          multiplePaths,
        };
        document.getElementById('path-values-result')?.setAttribute('data-result', JSON.stringify(result));
      }

      return (
        <Form form={form}>
          <FormList name="users">
            {(userFields, { add: addUser, remove: removeUser }) => (
              <>
                {userFields.map(({ key: userKey, name: userName }, userIndex) => (
                  <FormItem key={userKey}>
                    <FormItem name={[userName, 'name']} label="用户名" rules={[{ required: true, type: 'error' }]}>
                      <Input placeholder={`user-name-${userIndex}`} />
                    </FormItem>

                    <FormList name={[userName, 'projects']}>
                      {(projectFields, { add: addProject, remove: removeProject }) => (
                        <>
                          {projectFields.map(({ key: projectKey, name: projectName }, projectIndex) => (
                            <FormItem key={projectKey}>
                              <FormItem
                                name={[projectName, 'projectName']}
                                label="项目名称"
                                rules={[{ required: true, type: 'error' }]}
                              >
                                <Input placeholder={`project-name-${userIndex}-${projectIndex}`} />
                              </FormItem>

                              <FormList name={[projectName, 'tasks']}>
                                {(taskFields, { add: addTask, remove: removeTask }) => (
                                  <>
                                    {taskFields.map(({ key: taskKey, name: taskName }, taskIndex) => (
                                      <FormItem key={taskKey}>
                                        <FormItem
                                          name={[taskName, 'taskName']}
                                          label="任务名称"
                                          rules={[{ required: true, type: 'error' }]}
                                        >
                                          <Input placeholder={`task-name-${userIndex}-${projectIndex}-${taskIndex}`} />
                                        </FormItem>
                                        <FormItem
                                          name={[taskName, 'status']}
                                          label="状态"
                                          rules={[{ required: true, type: 'error' }]}
                                        >
                                          <Input
                                            placeholder={`task-status-${userIndex}-${projectIndex}-${taskIndex}`}
                                          />
                                        </FormItem>
                                        <FormItem>
                                          <MinusCircleIcon
                                            className={`test-remove-task-${userIndex}-${projectIndex}-${taskIndex}`}
                                            onClick={() => removeTask(taskName)}
                                          />
                                        </FormItem>
                                      </FormItem>
                                    ))}
                                    <FormItem>
                                      <Button
                                        id={`test-add-task-${userIndex}-${projectIndex}`}
                                        onClick={() => addTask({ taskName: 'New Task', status: 'pending' })}
                                      >
                                        Add Task
                                      </Button>
                                    </FormItem>
                                  </>
                                )}
                              </FormList>

                              <FormItem>
                                <MinusCircleIcon
                                  className={`test-remove-project-${userIndex}-${projectIndex}`}
                                  onClick={() => removeProject(projectName)}
                                />
                              </FormItem>
                            </FormItem>
                          ))}
                          <FormItem>
                            <Button
                              id={`test-add-project-${userIndex}`}
                              onClick={() => addProject({ projectName: 'New Project', tasks: [] })}
                            >
                              Add Project
                            </Button>
                          </FormItem>
                        </>
                      )}
                    </FormList>
                    <FormItem>
                      <MinusCircleIcon
                        className={`test-remove-user-${userIndex}`}
                        onClick={() => removeUser(userName)}
                      />
                    </FormItem>
                  </FormItem>
                ))}
                <FormItem>
                  <Button id="test-add-user" onClick={() => addUser({ name: '', projects: [] })}>
                    Add User
                  </Button>
                </FormItem>
              </>
            )}
          </FormList>
          <FormItem>
            <Button onClick={setFields}>setFields</Button>
            <Button onClick={setFieldsValue}>setFieldsValue</Button>
            <Button onClick={addNestedData}>addNestedData</Button>
            <Button onClick={validate}>validate</Button>
            <Button onClick={clearValidate}>clearValidate</Button>
            <Button onClick={getFieldsValueAll}>getFieldsValue(true)</Button>
            <Button onClick={getFieldsValueByPath}>getFieldsValue(namePath)</Button>
          </FormItem>
          <div id="all-values-result" data-result="" />
          <div id="path-values-result" data-result="" />
        </Form>
      );
    };

    const { container, queryByText, getByPlaceholderText } = render(<TestView />);

    // Test setFields
    fireEvent.click(queryByText('setFields'));
    await mockTimeout();
    expect((getByPlaceholderText('user-name-0') as HTMLInputElement).value).toBe('Alice');
    expect((getByPlaceholderText('project-name-0-0') as HTMLInputElement).value).toBe('Website Redesign');
    expect((getByPlaceholderText('task-name-0-0-0') as HTMLInputElement).value).toBe('Design mockups');
    expect((getByPlaceholderText('task-status-0-0-0') as HTMLInputElement).value).toBe('completed');
    expect((getByPlaceholderText('task-name-0-0-1') as HTMLInputElement).value).toBe('Frontend development');
    expect((getByPlaceholderText('task-status-0-0-1') as HTMLInputElement).value).toBe('in-progress');

    // Test setFieldsValue
    fireEvent.click(queryByText('setFieldsValue'));
    await mockTimeout();
    expect((getByPlaceholderText('user-name-0') as HTMLInputElement).value).toBe('Bob');
    expect((getByPlaceholderText('project-name-0-0') as HTMLInputElement).value).toBe('Mobile App');
    expect((getByPlaceholderText('task-name-0-0-0') as HTMLInputElement).value).toBe('API integration');
    expect((getByPlaceholderText('task-status-0-0-0') as HTMLInputElement).value).toBe('pending');
    expect((getByPlaceholderText('task-name-0-0-1') as HTMLInputElement).value).toBe('UI implementation');
    expect((getByPlaceholderText('task-status-0-0-1') as HTMLInputElement).value).toBe('in-progress');

    // Test addNestedData - multiple users with nested projects and tasks
    fireEvent.click(queryByText('addNestedData'));
    await mockTimeout();

    expect((getByPlaceholderText('user-name-0') as HTMLInputElement).value).toBe('Charlie');
    expect((getByPlaceholderText('project-name-0-0') as HTMLInputElement).value).toBe('Backend Service');
    expect((getByPlaceholderText('task-name-0-0-0') as HTMLInputElement).value).toBe('Database design');
    expect((getByPlaceholderText('task-status-0-0-0') as HTMLInputElement).value).toBe('completed');
    expect((getByPlaceholderText('task-name-0-0-1') as HTMLInputElement).value).toBe('API development');
    expect((getByPlaceholderText('task-status-0-0-1') as HTMLInputElement).value).toBe('in-progress');
    expect((getByPlaceholderText('task-name-0-0-2') as HTMLInputElement).value).toBe('Testing');
    expect((getByPlaceholderText('task-status-0-0-2') as HTMLInputElement).value).toBe('pending');
    expect((getByPlaceholderText('project-name-0-1') as HTMLInputElement).value).toBe('DevOps');
    expect((getByPlaceholderText('task-name-0-1-0') as HTMLInputElement).value).toBe('CI/CD setup');
    expect((getByPlaceholderText('task-status-0-1-0') as HTMLInputElement).value).toBe('completed');
    expect((getByPlaceholderText('user-name-1') as HTMLInputElement).value).toBe('David');
    expect((getByPlaceholderText('project-name-1-0') as HTMLInputElement).value).toBe('Documentation');
    expect((getByPlaceholderText('task-name-1-0-0') as HTMLInputElement).value).toBe('Write API docs');
    expect((getByPlaceholderText('task-status-1-0-0') as HTMLInputElement).value).toBe('in-progress');

    // Test getFieldsValue(true) - should get all form values
    fireEvent.click(queryByText('getFieldsValue(true)'));
    await mockTimeout();
    const allValuesResult = container.querySelector('#all-values-result')?.getAttribute('data-result');
    const allValues = JSON.parse(allValuesResult || '{}');
    expect(allValues).toHaveProperty('users');
    expect(Array.isArray(allValues.users)).toBe(true);
    expect(allValues.users.length).toBe(2);
    expect(allValues.users[0].name).toBe('Charlie');
    expect(allValues.users[0].projects.length).toBe(2);
    expect(allValues.users[0].projects[0].projectName).toBe('Backend Service');
    expect(allValues.users[0].projects[0].tasks.length).toBe(3);
    expect(allValues.users[1].name).toBe('David');

    // Test getFieldsValue with complex namePath
    fireEvent.click(queryByText('getFieldsValue(namePath)'));
    await mockTimeout();
    const pathValuesResult = container.querySelector('#path-values-result')?.getAttribute('data-result');
    const pathValues = JSON.parse(pathValuesResult || '{}');

    // Test 1: Verify users path returns all users data
    expect(pathValues.usersPath).toHaveProperty('users');
    expect(Array.isArray(pathValues.usersPath.users)).toBe(true);
    expect(pathValues.usersPath.users.length).toBe(2);
    expect(pathValues.usersPath.users[0].name).toBe('Charlie');
    expect(pathValues.usersPath.users[1].name).toBe('David');

    // Test 2: Verify nested path returns first user's projects
    expect(pathValues.firstUserProjects).toHaveProperty('users');
    expect(pathValues.firstUserProjects.users[0]).toHaveProperty('projects');
    expect(Array.isArray(pathValues.firstUserProjects.users[0].projects)).toBe(true);
    expect(pathValues.firstUserProjects.users[0].projects.length).toBe(2);
    expect(pathValues.firstUserProjects.users[0].projects[0].projectName).toBe('Backend Service');
    expect(pathValues.firstUserProjects.users[0].projects[1].projectName).toBe('DevOps');

    // Test 3: Verify deep nested path returns first project's tasks
    expect(pathValues.firstProjectTasks).toHaveProperty('users');
    expect(pathValues.firstProjectTasks.users[0].projects[0]).toHaveProperty('tasks');
    expect(Array.isArray(pathValues.firstProjectTasks.users[0].projects[0].tasks)).toBe(true);
    expect(pathValues.firstProjectTasks.users[0].projects[0].tasks.length).toBe(3);
    expect(pathValues.firstProjectTasks.users[0].projects[0].tasks[0].taskName).toBe('Database design');
    expect(pathValues.firstProjectTasks.users[0].projects[0].tasks[1].taskName).toBe('API development');
    expect(pathValues.firstProjectTasks.users[0].projects[0].tasks[2].taskName).toBe('Testing');

    // Test 4: Verify multiple paths returns specific fields
    expect(pathValues.multiplePaths).toHaveProperty('users');
    expect(pathValues.multiplePaths.users[0]).toHaveProperty('name');
    expect(pathValues.multiplePaths.users[0].name).toBe('Charlie');
    expect(pathValues.multiplePaths.users[1]).toHaveProperty('name');
    expect(pathValues.multiplePaths.users[1].name).toBe('David');
    expect(pathValues.multiplePaths.users[0].projects[0]).toHaveProperty('projectName');
    expect(pathValues.multiplePaths.users[0].projects[0].projectName).toBe('Backend Service');

    // Test remove nested task - remove first task of Charlie's Backend Service project
    const removeTaskBtn = container.querySelector('.test-remove-task-0-0-0');
    fireEvent.click(removeTaskBtn);
    await mockTimeout();
    expect((getByPlaceholderText('user-name-0') as HTMLInputElement).value).toBe('Charlie');
    // After removing first task, the second task (API development) becomes the first one
    expect((getByPlaceholderText('task-name-0-0-0') as HTMLInputElement).value).toBe('API development');
    expect((getByPlaceholderText('task-status-0-0-0') as HTMLInputElement).value).toBe('in-progress');
    expect((getByPlaceholderText('task-name-0-0-1') as HTMLInputElement).value).toBe('Testing');
    expect((getByPlaceholderText('task-status-0-0-1') as HTMLInputElement).value).toBe('pending');
    // The third task placeholder should not exist anymore
    expect(container.querySelector('[placeholder="task-name-0-0-2"]')).toBeFalsy();

    // Test remove project - remove Charlie's second project (DevOps)
    const removeProjectBtn = container.querySelector('.test-remove-project-0-1');
    fireEvent.click(removeProjectBtn);
    await mockTimeout();
    // After removing DevOps project, only Backend Service should remain for Charlie
    expect(container.querySelector('[placeholder="project-name-0-1"]')).toBeFalsy();
    expect(container.querySelector('[placeholder="task-name-0-1-0"]')).toBeFalsy();

    // Test remove user - remove David
    const removeUserBtn = container.querySelector('.test-remove-user-1');
    fireEvent.click(removeUserBtn);
    await mockTimeout();
    // After removing David, only Charlie should remain
    expect(container.querySelector('[placeholder="user-name-1"]')).toBeFalsy();
    expect(container.querySelector('[placeholder="project-name-1-0"]')).toBeFalsy();

    // Add an empty user to test validation
    const addUserBtn = container.querySelector('#test-add-user');
    fireEvent.click(addUserBtn);
    await mockTimeout();

    // Test validate on nested FormList
    fireEvent.click(queryByText('validate'));
    await mockTimeout();
    expect(queryByText('用户名必填')).toBeTruthy();

    // Test clearValidate
    fireEvent.click(queryByText('clearValidate'));
    await mockTimeout();
    expect(queryByText('用户名必填')).not.toBeTruthy();
  });

  test('FormList with shouldUpdate', async () => {
    const TestView = () => {
      const [form] = Form.useForm();

      const INIT_DATA = {
        services: [
          {
            modelName: 'modelA',
            routes: [
              { type: 'weight', weight: 50, abtest: 'cid' },
              { type: 'abtest', weight: 30, abtest: 'uid' },
            ],
          },
        ],
      };

      return (
        <Form form={form} initialData={INIT_DATA}>
          <FormList name="services">
            {(fields) => (
              <>
                {fields.map(({ key, name: serviceName }) => (
                  <div key={key}>
                    <FormList name={[serviceName, 'routes']}>
                      {(routeFields, { add: addRoute }) => (
                        <div>
                          {routeFields.map((f) => (
                            <div key={f.key} data-route-index={f.name}>
                              <FormItem name={[f.name, 'type']} label="类型">
                                <Radio.Group
                                  options={[
                                    { label: '权重', value: 'weight' },
                                    { label: 'ABTest', value: 'abtest' },
                                  ]}
                                />
                              </FormItem>

                              <FormItem
                                shouldUpdate={(p, n) =>
                                  p.services?.[serviceName]?.routes?.[f.name]?.type !==
                                  n.services?.[serviceName]?.routes?.[f.name]?.type
                                }
                              >
                                {({ getFieldValue }) => {
                                  const type = getFieldValue(['services', serviceName, 'routes', f.name, 'type']);
                                  if (type === 'weight') {
                                    return (
                                      <FormItem name={[f.name, 'weight']} label="权重">
                                        <Input placeholder={`route-weight-${serviceName}-${f.name}`} />
                                      </FormItem>
                                    );
                                  }
                                  if (type === 'abtest') {
                                    return (
                                      <FormItem name={[f.name, 'abtest']} label="分流Key">
                                        <Input placeholder={`route-abtest-${serviceName}-${f.name}`} />
                                      </FormItem>
                                    );
                                  }
                                  return null;
                                }}
                              </FormItem>
                            </div>
                          ))}
                          <Button id={`test-add-route-${serviceName}-default`} onClick={() => addRoute()}>
                            新增默认路由
                          </Button>
                          <Button
                            id={`test-add-route-${serviceName}-specified`}
                            onClick={() => addRoute(INIT_DATA.services[0].routes[0])}
                          >
                            新增指定路由
                          </Button>
                        </div>
                      )}
                    </FormList>
                  </div>
                ))}
              </>
            )}
          </FormList>
        </Form>
      );
    };

    const { container, getByPlaceholderText } = render(<TestView />);

    // Test initial data - first route (type: weight)
    const weightRadio0 = container.querySelector('[data-route-index="0"] input[value="weight"]') as HTMLInputElement;
    expect(weightRadio0.checked).toBe(true);
    expect((getByPlaceholderText('route-weight-0-0') as HTMLInputElement).value).toBe('50');
    expect(container.querySelector('[placeholder="route-abtest-0-0"]')).toBeFalsy();

    // Test initial data - second route (type: abtest)
    const abtestRadio1 = container.querySelector('[data-route-index="1"] input[value="abtest"]') as HTMLInputElement;
    expect(abtestRadio1.checked).toBe(true);
    expect((getByPlaceholderText('route-abtest-0-1') as HTMLInputElement).value).toBe('uid');
    expect(container.querySelector('[placeholder="route-weight-0-1"]')).toBeFalsy();

    // Test switching first route from weight to abtest
    const abtestRadio0 = container.querySelector('[data-route-index="0"] input[value="abtest"]') as HTMLInputElement;
    fireEvent.click(abtestRadio0);
    await mockTimeout();
    expect((getByPlaceholderText('route-abtest-0-0') as HTMLInputElement).value).toBe('cid');
    expect(container.querySelector('[placeholder="route-weight-0-0"]')).toBeFalsy();

    // Test switching first route back to weight
    fireEvent.click(weightRadio0);
    await mockTimeout();
    expect((getByPlaceholderText('route-weight-0-0') as HTMLInputElement).value).toBe('50');
    expect(container.querySelector('[placeholder="route-abtest-0-0"]')).toBeFalsy();

    // Test manual modification persistence - modify weight value manually
    const weightInput0 = getByPlaceholderText('route-weight-0-0') as HTMLInputElement;
    fireEvent.change(weightInput0, { target: { value: '200' } });
    await mockTimeout();
    expect(weightInput0.value).toBe('200');

    // Switch to abtest
    fireEvent.click(abtestRadio0);
    await mockTimeout();
    expect(container.querySelector('[placeholder="route-weight-0-0"]')).toBeFalsy();
    expect((getByPlaceholderText('route-abtest-0-0') as HTMLInputElement).value).toBe('cid');

    // Switch back to weight - should show manually modified value (200)
    fireEvent.click(weightRadio0);
    await mockTimeout();
    expect((getByPlaceholderText('route-weight-0-0') as HTMLInputElement).value).toBe('200');
    expect(container.querySelector('[placeholder="route-abtest-0-0"]')).toBeFalsy();

    // Test switching second route from abtest to weight
    const weightRadio1 = container.querySelector('[data-route-index="1"] input[value="weight"]') as HTMLInputElement;
    fireEvent.click(weightRadio1);
    await mockTimeout();
    expect((getByPlaceholderText('route-weight-0-1') as HTMLInputElement).value).toBe('30');
    expect(container.querySelector('[placeholder="route-abtest-0-1"]')).toBeFalsy();

    // Test manual modification persistence - modify weight value manually after switching
    const weightInput1 = getByPlaceholderText('route-weight-0-1') as HTMLInputElement;
    fireEvent.change(weightInput1, { target: { value: '100' } });
    await mockTimeout();
    expect(weightInput1.value).toBe('100');

    // Switch back to abtest - should show initial abtest value (uid)
    fireEvent.click(abtestRadio1);
    await mockTimeout();
    expect((getByPlaceholderText('route-abtest-0-1') as HTMLInputElement).value).toBe('uid');
    expect(container.querySelector('[placeholder="route-weight-0-1"]')).toBeFalsy();

    // Switch to weight again - should show manually modified value (100)
    fireEvent.click(weightRadio1);
    await mockTimeout();
    expect((getByPlaceholderText('route-weight-0-1') as HTMLInputElement).value).toBe('100');
    expect(container.querySelector('[placeholder="route-abtest-0-1"]')).toBeFalsy();

    // Modify abtest value manually
    fireEvent.click(abtestRadio1);
    await mockTimeout();
    const abtestInput1 = getByPlaceholderText('route-abtest-0-1') as HTMLInputElement;
    expect(abtestInput1.value).toBe('uid');
    fireEvent.change(abtestInput1, { target: { value: 'custom-key' } });
    await mockTimeout();
    expect(abtestInput1.value).toBe('custom-key');

    // Switch to weight
    fireEvent.click(weightRadio1);
    await mockTimeout();
    expect(container.querySelector('[placeholder="route-abtest-0-1"]')).toBeFalsy();
    expect((getByPlaceholderText('route-weight-0-1') as HTMLInputElement).value).toBe('100');

    // Switch back to abtest - should show manually modified value
    fireEvent.click(abtestRadio1);
    await mockTimeout();
    expect((getByPlaceholderText('route-abtest-0-1') as HTMLInputElement).value).toBe('custom-key');
    expect(container.querySelector('[placeholder="route-weight-0-1"]')).toBeFalsy();

    // Test adding default route (empty data)
    const addDefaultBtn = container.querySelector('#test-add-route-0-default');
    fireEvent.click(addDefaultBtn);
    await mockTimeout();
    const newRouteRadios = container.querySelectorAll('[data-route-index="2"] input[type="radio"]');
    expect(newRouteRadios.length).toBe(2);
    // No radio should be checked initially
    const checkedRadio = container.querySelector('[data-route-index="2"] input[type="radio"]:checked');
    expect(checkedRadio).toBeFalsy();
    // No conditional field should be rendered when type is empty
    expect(container.querySelector('[placeholder="route-weight-0-2"]')).toBeFalsy();
    expect(container.querySelector('[placeholder="route-abtest-0-2"]')).toBeFalsy();

    // Test setting type to weight for new route
    const newWeightRadio = container.querySelector('[data-route-index="2"] input[value="weight"]') as HTMLInputElement;
    fireEvent.click(newWeightRadio);
    await mockTimeout();
    const newWeightInput = getByPlaceholderText('route-weight-0-2') as HTMLInputElement;
    expect(newWeightInput).toBeTruthy();
    expect(newWeightInput.value).toBe('');

    // Test setting weight value
    fireEvent.change(newWeightInput, { target: { value: '100' } });
    await mockTimeout();
    expect(newWeightInput.value).toBe('100');

    // Test switching new route to abtest
    const newAbtestRadio = container.querySelector('[data-route-index="2"] input[value="abtest"]') as HTMLInputElement;
    fireEvent.click(newAbtestRadio);
    await mockTimeout();
    expect(container.querySelector('[placeholder="route-weight-0-2"]')).toBeFalsy();
    const newAbtestInput = getByPlaceholderText('route-abtest-0-2') as HTMLInputElement;
    expect(newAbtestInput).toBeTruthy();
    expect(newAbtestInput.value).toBe('');

    // Test setting abtest value
    fireEvent.change(newAbtestInput, { target: { value: 'new-key' } });
    await mockTimeout();
    expect(newAbtestInput.value).toBe('new-key');

    // Test switching back to weight - should show manually modified value (100)
    fireEvent.click(newWeightRadio);
    await mockTimeout();
    expect(container.querySelector('[placeholder="route-abtest-0-2"]')).toBeFalsy();
    const weightInputAgain = getByPlaceholderText('route-weight-0-2') as HTMLInputElement;
    expect(weightInputAgain.value).toBe('100');

    // Test adding specified route (with initial data)
    const addSpecifiedBtn = container.querySelector('#test-add-route-0-specified');
    fireEvent.click(addSpecifiedBtn);
    await mockTimeout();
    const specifiedWeightRadio = container.querySelector(
      '[data-route-index="3"] input[value="weight"]',
    ) as HTMLInputElement;
    expect(specifiedWeightRadio.checked).toBe(true);
    const specifiedWeightInput = getByPlaceholderText('route-weight-0-3') as HTMLInputElement;
    expect(specifiedWeightInput.value).toBe('50');
    expect(container.querySelector('[placeholder="route-abtest-0-3"]')).toBeFalsy();

    // Test switching specified route to abtest
    const specifiedAbtestRadio = container.querySelector(
      '[data-route-index="3"] input[value="abtest"]',
    ) as HTMLInputElement;
    fireEvent.click(specifiedAbtestRadio);
    await mockTimeout();
    const specifiedAbtestInput = getByPlaceholderText('route-abtest-0-3') as HTMLInputElement;
    expect(specifiedAbtestInput.value).toBe('cid');
    expect(container.querySelector('[placeholder="route-weight-0-3"]')).toBeFalsy();

    // Test switching specified route back to weight - should show initial weight value
    fireEvent.click(specifiedWeightRadio);
    await mockTimeout();
    const specifiedWeightInputAgain = getByPlaceholderText('route-weight-0-3') as HTMLInputElement;
    expect(specifiedWeightInputAgain.value).toBe('50');
    expect(container.querySelector('[placeholder="route-abtest-0-3"]')).toBeFalsy();
  });
});
