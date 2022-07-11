export function toTree(orgs: any) {
  const res = [];
  const map: any = {};

  for (let i = 0; i < orgs.length; i++) {
    map[orgs[i].id] = orgs[i];
    orgs[i].children = [];
  }

  for (let i = 0; i < orgs.length; i++) {
    if (orgs[i].parent) {
      map[orgs[i].parent].children.push(orgs[i]);
    } else {
      res.push(orgs[i]);
    }
  }
  return res;
}

export function treeToList(tree: any) {
  const queue = [...tree];
  const res = [];
  while (queue.length) {
    const first = queue.shift();
    if (first.children) {
      queue.push(...first.children);
      delete first.children;
    }
    res.push(first);
  }
  return res;
}

export function searchParentById(tree: any, id: string) {
  if (!id) {
    return tree;
  }
  const queue = [...tree];
  while (queue.length) {
    const first = queue.shift();
    if (first.id === id) {
      return first;
    }
    if (first.children) {
      queue.push(...first.children);
      delete first.children;
    }
  }
  return null;
}

export function deleteFromTree(tree: any, id: string) {
  if (!id) {
    return tree;
  }
  const t: any = {
    children: tree,
  };
  let res: any;
  function traverse(t: any) {
    if (t.children) {
      const index = t.children.findIndex((item: any) => item.id === id);
      if (index > -1) {
        res = t.children.splice(index, 1);
        return;
      }
      t.children.forEach((item: any) => traverse(item));
    }
  }
  traverse(t);
  return res[0];
}

export function insertToTree(tree: any, id: string, insertTree: any) {
  if (!id) {
    tree.push(insertTree);
    return;
  }
  const queue = [...tree];
  while (queue.length) {
    const first = queue.shift();
    if (first.id === id) {
      if (first.children) {
        insertTree.parent = id;
        first.children.push(insertTree);
        return;
      }
    }
    if (first.children) {
      queue.push(...first.children);
    }
  }
}

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
