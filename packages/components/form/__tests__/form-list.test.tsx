import React from 'react';
import { MinusCircleIcon } from 'tdesign-icons-react';
import { fireEvent, mockTimeout, render, vi } from '@test/utils';

import Button from '../../button';
import Input from '../../input';
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

describe('Form List 组件测试', () => {
  test('form list 测试', async () => {
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

      return (
        <BasicForm
          form={form}
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
            </>
          )}
        />
      );
    };

    const { container, queryByDisplayValue, queryByText } = render(<TestView />);
    const addBtn = container.querySelector('#test-add-with-data');
    const submitBtn = queryByText('submit');
    const resetBtn = queryByText('reset');

    fireEvent.click(addBtn);
    expect(queryByDisplayValue('guangdong')).toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).toBeTruthy();
    fireEvent.click(resetBtn);
    fireEvent.click(submitBtn);
    await mockTimeout(() => true);
    expect(queryByText('guangdong')).not.toBeTruthy();
    expect(queryByText('shenzhen')).not.toBeTruthy();

    fireEvent.click(addBtn);
    expect(queryByDisplayValue('guangdong')).toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).toBeTruthy();
    const removeBtn = container.querySelector('.test-remove-0');
    fireEvent.click(removeBtn);
    expect(queryByDisplayValue('guangdong')).not.toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).not.toBeTruthy();

    fireEvent.click(queryByText('setFields'));
    await mockTimeout(() => true);
    expect(queryByDisplayValue('setFields')).toBeTruthy();
    fireEvent.click(queryByText('setFieldsValue'));
    await mockTimeout(() => true);
    expect(queryByDisplayValue('setFieldsValue')).toBeTruthy();

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

  test('reset to initial data', async () => {
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
    const resetBtn = queryByText('reset');

    const removeBtn = container.querySelector('.test-remove-0');
    fireEvent.click(removeBtn);
    await mockTimeout(() => true);
    expect((getByPlaceholderText('area-input-0') as HTMLInputElement).value).toBe('beijing');
    fireEvent.click(resetBtn);
    await mockTimeout(() => true);
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

  test('Multiple nested FormList', async () => {
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

      return (
        <Form form={form}>
          <FormList name="users">
            {(userFields, { add: addUser, remove: removeUser }) => (
              <>
                {userFields.map(({ key: userKey, name: userName, ...userRestField }, userIndex) => (
                  <FormItem key={userKey}>
                    <FormItem
                      {...userRestField}
                      name={[userName, 'name']}
                      label="用户名"
                      rules={[{ required: true, type: 'error' }]}
                    >
                      <Input placeholder={`user-name-${userIndex}`} />
                    </FormItem>

                    <FormList name={[userName, 'projects']}>
                      {(projectFields, { add: addProject, remove: removeProject }) => (
                        <>
                          {projectFields.map(
                            ({ key: projectKey, name: projectName, ...projectRestField }, projectIndex) => (
                              <FormItem key={projectKey}>
                                <FormItem
                                  {...projectRestField}
                                  name={[projectName, 'projectName']}
                                  label="项目名称"
                                  rules={[{ required: true, type: 'error' }]}
                                >
                                  <Input placeholder={`project-name-${userIndex}-${projectIndex}`} />
                                </FormItem>

                                <FormList name={[projectName, 'tasks']}>
                                  {(taskFields, { add: addTask, remove: removeTask }) => (
                                    <>
                                      {taskFields.map(
                                        ({ key: taskKey, name: taskName, ...taskRestField }, taskIndex) => (
                                          <FormItem key={taskKey}>
                                            <FormItem
                                              {...taskRestField}
                                              name={[taskName, 'taskName']}
                                              label="任务名称"
                                              rules={[{ required: true, type: 'error' }]}
                                            >
                                              <Input
                                                placeholder={`task-name-${userIndex}-${projectIndex}-${taskIndex}`}
                                              />
                                            </FormItem>
                                            <FormItem
                                              {...taskRestField}
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
                                        ),
                                      )}
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
                            ),
                          )}
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
          </FormItem>
        </Form>
      );
    };

    const { container, queryByText, getByPlaceholderText } = render(<TestView />);

    // Test setFields
    fireEvent.click(queryByText('setFields'));
    await mockTimeout(() => true);
    expect((getByPlaceholderText('user-name-0') as HTMLInputElement).value).toBe('Alice');
    expect((getByPlaceholderText('project-name-0-0') as HTMLInputElement).value).toBe('Website Redesign');
    expect((getByPlaceholderText('task-name-0-0-0') as HTMLInputElement).value).toBe('Design mockups');
    expect((getByPlaceholderText('task-status-0-0-0') as HTMLInputElement).value).toBe('completed');
    expect((getByPlaceholderText('task-name-0-0-1') as HTMLInputElement).value).toBe('Frontend development');
    expect((getByPlaceholderText('task-status-0-0-1') as HTMLInputElement).value).toBe('in-progress');

    // Test setFieldsValue
    fireEvent.click(queryByText('setFieldsValue'));
    await mockTimeout(() => true);
    expect((getByPlaceholderText('user-name-0') as HTMLInputElement).value).toBe('Bob');
    expect((getByPlaceholderText('project-name-0-0') as HTMLInputElement).value).toBe('Mobile App');
    expect((getByPlaceholderText('task-name-0-0-0') as HTMLInputElement).value).toBe('API integration');
    expect((getByPlaceholderText('task-status-0-0-0') as HTMLInputElement).value).toBe('pending');
    expect((getByPlaceholderText('task-name-0-0-1') as HTMLInputElement).value).toBe('UI implementation');
    expect((getByPlaceholderText('task-status-0-0-1') as HTMLInputElement).value).toBe('in-progress');

    // Wait a bit more to ensure DOM is fully updated before next operation
    await mockTimeout(() => true);

    // Test addNestedData - multiple users with nested projects and tasks
    fireEvent.click(queryByText('addNestedData'));
    await mockTimeout(() => true);
    // Add another wait to ensure all nested FormLists are fully rendered
    await mockTimeout(() => true);

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

    // Test remove nested task - remove first task of Charlie's Backend Service project
    const removeTaskBtn = container.querySelector('.test-remove-task-0-0-0');
    fireEvent.click(removeTaskBtn);
    await mockTimeout(() => true);
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
    await mockTimeout(() => true);
    // After removing DevOps project, only Backend Service should remain for Charlie
    expect(container.querySelector('[placeholder="project-name-0-1"]')).toBeFalsy();
    expect(container.querySelector('[placeholder="task-name-0-1-0"]')).toBeFalsy();

    // Test remove user - remove David
    const removeUserBtn = container.querySelector('.test-remove-user-1');
    fireEvent.click(removeUserBtn);
    await mockTimeout(() => true);
    // After removing David, only Charlie should remain
    expect(container.querySelector('[placeholder="user-name-1"]')).toBeFalsy();
    expect(container.querySelector('[placeholder="project-name-1-0"]')).toBeFalsy();

    // Add an empty user to test validation
    const addUserBtn = container.querySelector('#test-add-user');
    fireEvent.click(addUserBtn);
    await mockTimeout(() => true);

    // Test validate on nested FormList
    fireEvent.click(queryByText('validate'));
    await mockTimeout(() => true);
    expect(queryByText('用户名必填')).toBeTruthy();

    // Test clearValidate
    fireEvent.click(queryByText('clearValidate'));
    await mockTimeout(() => true);
    expect(queryByText('用户名必填')).not.toBeTruthy();
  });
});
