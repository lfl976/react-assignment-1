import { Button, Checkbox, Form, Input, Modal, Radio } from "antd";
import { useContext, useRef, useState } from "react";
import { DataContext } from "../App";
import { IconOrganize, IconUser } from "../icon";
import {
  addOrgToTree,
  classNames,
  insertMemberToTree,
  updateMemberOfTree,
  updateOrgNameOfTree,
} from "../utils";
import { TreeItem } from "./Tree";

interface TreeNodeProps {
  treeItem: TreeItem;
  parent: TreeItem | string;
}

export function TreeNode({ treeItem, parent }: TreeNodeProps) {
  const nodeRef = useRef(null);
  const { list, setIsEdit } = useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [formAddMember] = Form.useForm();

  function handleAddOrg() {
    setEditItem({});
    setIsEdit(true);
    setIsModalVisible(true);
    form.resetFields();
  }

  function handleEditOrg(item: any) {
    setEditItem(item);
    setIsEdit(true);
    setIsModalVisible(true);
    form.setFieldsValue({ OrgName: item.name });
  }

  function handleAddMember() {
    setEditItem({ status: "activated" });
    setIsEdit(true);
    setIsAddMemberModalVisible(true);
    formAddMember.resetFields();
  }

  function handleEditMember(item: any) {
    setEditItem(item);
    setIsEdit(true);
    setIsAddMemberModalVisible(true);
    formAddMember.resetFields();
    formAddMember.setFieldsValue({
      name: item.name,
      age: item.age,
      status: item.status,
    });
  }

  function handleOk() {
    setIsModalVisible(false);
    setIsAddMemberModalVisible(false);
  }

  function handleCancel() {
    setIsModalVisible(false);
    setIsAddMemberModalVisible(false);
    setIsEdit(false);
  }

  function onFinish(values: any) {
    if (editItem.type === "organization") {
      // TODO setState to up UI
      updateOrgNameOfTree(list, editItem.id, values.OrgName);
    } else {
      addOrgToTree(list, treeItem.id, values.OrgName);
    }
    setIsModalVisible(false);
    setIsEdit(false);
  }

  function onFinishFailed(errorInfo: any) {
    console.log("Failed:", errorInfo);
  }

  function onMemberFinish(values: any) {
    if (editItem.id) {
      const member = {
        ...values,
        id: editItem.id,
      };
      updateMemberOfTree(list, member);
    } else {
      const member = {
        ...values,
        id: `member-${Math.random().toString(32).substring(2)}`,
      };
      insertMemberToTree(list, treeItem.id, member);
    }
    setIsAddMemberModalVisible(false);
    setIsEdit(false);
  }
  function onMemberFinishFailed(errorInfo: any) {
    console.log("Failed:", errorInfo);
  }

  return (
    <>
      <div
        className={classNames("ml-16", "organize cursor-move mt-2")}
        data-oid={treeItem.id}
        data-p={treeItem.parent}
        ref={nodeRef}
      >
        <div
          className="organize-name"
          data-oid={treeItem.id}
          data-p={treeItem.parent}
        >
          <IconOrganize />
          <span className="org text-black text-2xl pointer-events-none">
            {treeItem.name}
          </span>
          <Button
            size="small"
            onClick={() => handleEditOrg(treeItem)}
            type="primary"
          >
            edit
          </Button>
        </div>
        <ul className="members">
          {treeItem.members?.map((item) => (
            <li key={item.id} data-mid={item.id} className="member">
              <IconUser
                color={item.id === treeItem.representation ? "red" : ""}
              />
              <span
                className={classNames(
                  "member-name pointer-events-none",
                  item.status === "activated"
                    ? "text-green-500"
                    : "text-gray-500"
                )}
              >
                {item.name}
              </span>
              <span className="ml-4 pointer-events-none">{`age: ${
                item.age ? item.age : "-"
              }`}</span>
              <Button size="small" onClick={() => handleEditMember(item)}>
                edit
              </Button>
            </li>
          ))}
        </ul>
        <div>
          <Button.Group>
            <Button size="small" onClick={handleAddOrg}>
              + Org
            </Button>
            <Button size="small" onClick={handleAddMember}>
              + Member
            </Button>
          </Button.Group>
        </div>
        {treeItem.children?.length > 0 &&
          treeItem.children.map((item) => (
            <TreeNode key={item.id} treeItem={item} parent={treeItem} />
          ))}
      </div>
      <Modal
        title="Update Org Name"
        visible={isModalVisible}
        forceRender
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="OrgName"
            name="OrgName"
            rules={[{ required: true, message: "Please input your orgame!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add member"
        visible={isAddMemberModalVisible}
        forceRender
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basicMember"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onMemberFinish}
          onFinishFailed={onMemberFinishFailed}
          autoComplete="off"
          form={formAddMember}
        >
          <Form.Item
            label="MemberName"
            name="name"
            rules={[
              { required: true, message: "Please input your member name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please input age!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Radio.Group>
              <Radio value={"activated"}>activated</Radio>
              <Radio value={"inactivated"}>inactivated</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Representation"
            valuePropName="checked"
            name="representation"
          >
            <Checkbox disabled={editItem?.status !== "activated"}>
              Set As Representation
            </Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
