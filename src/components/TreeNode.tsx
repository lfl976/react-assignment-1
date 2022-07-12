import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { DataContext } from "../App";
import { IconOrganize, IconUser } from "../icon";
import { classNames } from "../utils";
import { TreeItem } from "./Tree";

interface TreeNodeProps {
  treeItem: TreeItem;
  parent: TreeItem | string;
}

export function TreeNode({ treeItem, parent }: TreeNodeProps) {
  const [active, setActive] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const nodeRef = useRef(null);
  const { list, setList, moveItem, setMoveItem, setIsEdit } =
    useContext(DataContext);

  useEffect(() => {}, []);

  function mouseOver(event: any) {
    event.stopPropagation();
    console.log(treeItem);
  }

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
    // setMoveItem({
    //   treeItem,
    //   parent,
    // });
    console.log(parent);
    if (parent) {
      (parent as TreeItem).children = [];
      const arr = [...list];
      setList(arr);
    }
    console.log(treeItem);
    console.log((event.currentTarget as HTMLElement).getBoundingClientRect());
  }

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleMouseDown(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    // console.log(parent);
    setMoveItem({
      treeItem,
      parent,
    });
  }

  function handleMouseUp(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    // if (parent !== "" && parent === moveItem.parent) return;
    if (moveItem.parent === treeItem) return;
    if (moveItem.treeItem === treeItem) return;
    console.log(parent);
    if (moveItem.treeItem) {
      if (moveItem.parent) {
        moveItem.parent.children = [];
      }
      treeItem.children.push(moveItem.treeItem);
      console.log(list);
      setList([...list]);
    }

    console.log(
      "moveItem.treeItem === treeItem",
      moveItem.treeItem === treeItem
    );
    console.log("moveItem.parent === treeItem", moveItem.parent === treeItem);
  }

  function handleEditOrg(id: any) {
    setIsEdit(true);
    setIsModalVisible(true);
  }

  function handleOk() {
    setIsModalVisible(false);
  }

  function handleCancel() {
    setIsModalVisible(false);
    setIsEdit(false);
  }

  function onFinish(values: any) {
    console.log("Success:", values);
  }

  function onFinishFailed(errorInfo: any) {
    console.log("Failed:", errorInfo);
  }

  return (
    <>
      <div
        className={classNames("ml-16", "organize cursor-move mt-2")}
        data-oid={treeItem.id}
        data-p={treeItem.parent}
        ref={nodeRef}
        // onMouseOver={mouseOver}
        // onClick={handleClick}
        // onMouseDown={handleMouseDown}
        // onMouseUp={handleMouseUp}
        // onMouseMove={handleMouseMove}
      >
        <div
          className="organize-name"
          data-oid={treeItem.id}
          data-p={treeItem.parent}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   setActive(!active);
          // }}
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
            </li>
          ))}
        </ul>
        {active ? (
          treeItem.children?.length > 0 &&
          treeItem.children.map((item) => (
            <TreeNode key={item.id} treeItem={item} parent={treeItem} />
          ))
        ) : (
          <hr></hr>
        )}
      </div>
      <Modal
        title="Update Org Name"
        visible={isModalVisible}
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
    </>
  );
}
