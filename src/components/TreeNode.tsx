import React, { useContext, useEffect, useRef, useState } from "react";
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
  const nodeRef = useRef(null);
  const { list, setList, moveItem, setMoveItem } = useContext(DataContext);

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

  return (
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
        onClick={(e) => {
          e.stopPropagation();
          setActive(!active);
        }}
      >
        <IconOrganize />
        <span className="org text-black text-2xl pointer-events-none">
          {treeItem.name}
        </span>
      </div>
      <ul className="members">
        {treeItem.members?.map((item) => (
          <li
            key={item}
            data-mid={item}
            data-oid={treeItem.id}
            className="member"
          >
            <IconUser />
            <span className="member-name text-gray-500 pointer-events-none">
              {item}
            </span>
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
  );
}
