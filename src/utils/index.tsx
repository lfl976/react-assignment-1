export function toTree(orgs: any, members: any) {
  const res = [];
  const map: any = {};
  const memberMap: any = {};

  for (let i = 0; i < orgs.length; i++) {
    map[orgs[i].id] = orgs[i];
    orgs[i].children = [];
  }

  members.forEach((item: any) => {
    memberMap[item.id] = item;
  });

  for (let i = 0; i < orgs.length; i++) {
    if (orgs[i].members?.length) {
      const arr: any = [];
      orgs[i].members.forEach((item: any) => {
        if (memberMap[item]) {
          arr.push(memberMap[item]);
        }
      });
      orgs[i].members = arr;
    }
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

export function searcTreeById(tree: any, id: string) {
  const queue = [...tree];
  while (queue.length) {
    const first = queue.shift();
    if (first.id === id) {
      return first;
    }
    if (first.children) {
      queue.push(...first.children);
    }
  }
  return null;
}

export function isChildOfParent(tree: any, parentId: string, childId: string) {
  const pTree = searcTreeById(tree, parentId);
  if (searcTreeById([pTree], childId)) {
    return true;
  }
  return false;
}

// export function deleteMemberFromTree(tree: any, mid: string) {
//   if (!mid) return;
//   const t: any = {
//     children: tree,
//   };
//   let res: any;
//   function traverse(t: any) {
//     if (t.members?.length) {
//       const index = t.members.findIndex((item: any) => item.id === mid);
//       if (index > -1) {
//         res = t.members.splice(index, 1);
//         return;
//       }
//     }
//     if (t.children) {
//       t.children.forEach((item: any) => traverse(item));
//     }
//   }
//   traverse(t);
//   return res[0];
// }
export function deleteMemberFromTree(tree: any, mid: string) {
  if (!mid) return;
  const queue = [...tree];
  while (queue.length) {
    const first = queue.shift();
    const index = first.members.findIndex((item: any) => item.id === mid);
    if (index > -1) {
      if (first.representation === first.members[index].id) {
        first.representation = "";
      }
      return first.members.splice(index, 1)[0];
    }
    if (first.children) {
      queue.push(...first.children);
    }
  }
  return null;
}

export function insertMemberToTree(tree: any, oid: string, member: any) {
  if (!member) {
    return;
  }
  const queue = [...tree];
  while (queue.length) {
    const first = queue.shift();
    if (first.id === oid) {
      if (first.members) {
        first.members.push(member);
      } else {
        first.members = [member];
      }
      return;
    }
    if (first.children) {
      queue.push(...first.children);
    }
  }
}

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
