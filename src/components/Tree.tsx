import React, { useContext, useRef, useState } from "react";
import { DataContext } from "../App";
import {
  deleteFromTree,
  insertToTree,
  isChildOfParent,
  deleteMemberFromTree,
  insertMemberToTree,
} from "../utils";
import { TreeNode } from "./TreeNode";
export interface TreeItem {
  name: string;
  id: string;
  children: TreeItem[];
  members: any[];
  parent: string;
  representation: any;
}
interface TreeProps {
  tree: TreeItem[];
}
export function Tree({ tree }: TreeProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [offsetPosition, setOffsetPosition] = useState({ x: 0, y: 0 });
  const placeHolder = useRef(null);
  const { list, setList, moveItem, setMoveItem, isEdit } =
    useContext(DataContext);
  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isMoving) return;
    setPosition({
      x: event.pageX - offsetPosition.x,
      y: event.pageY - offsetPosition.y,
    });
  }

  function handleMouseDown(event: React.MouseEvent<HTMLElement>) {
    // console.log(event.currentTarget);
    if (!isEdit) {
      event.preventDefault();
    } else {
      return;
    }
    event.stopPropagation();
    // console.log((event.target as HTMLElement).dataset.oid);
    const dataset = (event.target as HTMLElement).dataset;
    console.log(dataset);
    if (dataset.oid) {
      console.log((event.target as HTMLElement).getBoundingClientRect());
      setMoveItem({ id: dataset.oid, parent: dataset.p, type: "org" });
      setIsMoving(true);
      setPosition({ x: event.pageX, y: event.pageY });
      (placeHolder.current as any).innerText = dataset.oid;
    } else if (dataset.mid) {
      setMoveItem({ id: dataset.mid, type: "member" });
      setIsMoving(true);
      setPosition({ x: event.pageX, y: event.pageY });
      (placeHolder.current as any).innerText = dataset.mid;
    } else {
      setMoveItem({});
    }
  }

  function handleMouseUp(event: React.MouseEvent<HTMLElement>) {
    if (!isEdit) {
      event.preventDefault();
    } else {
      return;
    }
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const classList = target.classList;
    const dataset = target.dataset;
    setIsMoving(false);
    if (moveItem.id === dataset.oid) return;
    if (moveItem.type === "org") {
      if (dataset.oid && moveItem.id) {
        const isChild = isChildOfParent(tree, moveItem.id, dataset.oid);
        if (isChild) return;
      }
      if (
        classList.contains("organize") ||
        classList.contains("organize-name")
      ) {
        setTree(moveItem.id, dataset.oid as string);
      } else if (classList.contains("member")) {
        const ppEle = (target as any).parentElement.parentElement;
        const oid = ppEle?.dataset.oid;
        if (moveItem.id === oid) return;
        if (oid) {
          const isChild = isChildOfParent(tree, moveItem.id, oid);
          if (isChild) return;
        }
        setTree(moveItem.id, oid);
      } else if (classList.contains("tree-container")) {
        setTree(moveItem.id, "");
      }
    } else if (moveItem.type === "member") {
      console.log("there");
      const moveMid = moveItem.id;
      console.log(moveItem);
      console.log(target);
      if (dataset.mid) {
        if (dataset.mid === moveMid) return;
        const ppEle = (target as any).parentElement.parentElement;
        const oid = ppEle?.dataset.oid;
        if (oid) {
          setTreeAfterMoveMember(oid, moveMid);
        }
      } else if (dataset.oid) {
        setTreeAfterMoveMember(dataset.oid, moveMid);
      }
    }
  }

  function setTreeAfterMoveMember(oid: string, mid: string) {
    const cloneTree = structuredClone(tree);
    const member = deleteMemberFromTree(cloneTree, mid);
    insertMemberToTree(cloneTree, oid, member);
    console.log(member);
    console.log(cloneTree);
    setList(cloneTree);
  }

  function setTree(moveId: string, targetId: string) {
    const cloneTree = structuredClone(tree);
    if (moveId) {
      const resTree = deleteFromTree(cloneTree, moveId);
      insertToTree(cloneTree, targetId, resTree);
      setList(cloneTree);
    }
  }

  return (
    <div
      className="tree-container"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {tree.length &&
        tree.map((item) => (
          <TreeNode key={item.id} treeItem={item} parent={""} />
        ))}

      <div
        className="text-2xl pointer-events-none border-2"
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          display: isMoving ? "block" : "none",
        }}
        ref={placeHolder}
      >
        Org
      </div>
    </div>
  );
}
