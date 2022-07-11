import React, { useContext, useRef, useState } from "react";
import { DataContext } from "../App";
import { deleteFromTree, insertToTree } from "../utils";
import { TreeNode } from "./TreeNode";
export interface TreeItem {
  name: string;
  id: string;
  children: TreeItem[];
  members: [];
  parent: string;
}
interface TreeProps {
  tree: TreeItem[];
}
export function Tree({ tree }: TreeProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const placeHolder = useRef(null);
  const { list, setList, moveItem, setMoveItem } = useContext(DataContext);
  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setPosition({ x: event.pageX, y: event.pageY });
  }

  function handleMouseDown(event: React.MouseEvent<HTMLElement>) {
    // console.log(event.currentTarget);
    event.preventDefault();
    event.stopPropagation();
    // console.log((event.target as HTMLElement).dataset.oid);
    const dataset = (event.target as HTMLElement).dataset;
    if (dataset.oid) {
      setMoveItem({ id: dataset.oid, parent: dataset.p, type: "org" });
      setIsMoving(true);
      setPosition({ x: event.pageX, y: event.pageY });
      (placeHolder.current as any).innerText = dataset.oid;
    } else if (dataset.mid) {
      setMoveItem({ id: dataset.mid, type: "member" });
    } else {
      setMoveItem({});
    }
  }

  function handleMouseUp(event: React.MouseEvent<HTMLElement>) {
    console.log(1);
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const classList = target.classList;
    const dataset = target.dataset;
    setIsMoving(false);
    if (moveItem.id === dataset.oid) return;
    if (moveItem.type === "org") {
      if (
        classList.contains("organize") ||
        classList.contains("organize-name") ||
        classList.contains("member")
      ) {
        setTree(moveItem.id, dataset.oid as string);
      } else if (classList.contains("tree-container")) {
        setTree(moveItem.id, "");
      }
    }
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
