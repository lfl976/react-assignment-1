import React, { useEffect, useState } from "react";
import "./App.css";
import { Tree, TreeItem } from "./components/Tree";
import { orgs, members } from "./data/orgs";
import { toTree } from "./utils";

interface ContextProp {
  moveItem: any;
  setMoveItem: Function;
  list: TreeItem[];
  setList: Function;
  isEdit: boolean;
  setIsEdit: Function;
}

export const DataContext = React.createContext<ContextProp>({} as ContextProp);

function App() {
  const [list, setList] = useState<TreeItem[]>([]);
  const [moveItem, setMoveItem] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const context = {
    list,
    setList,
    moveItem,
    setMoveItem,
    isEdit,
    setIsEdit,
  };

  useEffect(() => {
    setList(toTree(orgs, members));
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Org management</h1>
      <hr />
      <DataContext.Provider value={context}>
        <Tree tree={list} />
      </DataContext.Provider>
    </>
  );
}

export default App;
