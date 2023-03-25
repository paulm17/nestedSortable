export const getItem = (id: string, items: any[]) => {
  const searchItem = (items: any[], id: string) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.id === id) {
        return item;
      }

      const foundItem: any = searchItem(item.items, id);

      if (foundItem) {
        return foundItem;
      }
    }

    return null;
  };

  return searchItem(items, id);
};

// export function checkChildId(childId, items) {
//   for (const item of items) {
//     if (item.id === childId) {
//       return true;
//     }
//     if (item.items && item.items.length) {
//       const found = checkChildId(childId, item.items);
//       if (found) {
//         return true;
//       }
//     }
//   }
//   return false;
// }

export function getParentArray(childId: string, items: any[]): any[] {
  let parentArray = [] as any[];

  function findParent(childId: string, items: any[]) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.id === childId) {
        parentArray = items;
        break;
      } else if (item.items.length > 0) {
        findParent(childId, item.items);
      }
    }
  }

  findParent(childId, items);
  return parentArray;
}

export function getParentId(id: string, items: any[], parent: any = null) {
  const getParentId = (id: string, items: any[], parent: any) => {
    for (let item of items) {
      let res: any =
        item.id === id
          ? parent
          : item.items && getParentId(id, item.items, item);

      if (res) {
        return res;
      }
    }
  };

  const item = getParentId(id, items, parent);

  return item?.id;
}

export function getParentItems(childId, items) {
  if (childId === undefined) {
    return items;
  }

  function findParent(childId, items) {
    for (const item of items) {
      if (item.id === childId) {
        return item.items;
      } else if (item.items.length > 0) {
        const parentItems = findParent(childId, item.items);
        if (parentItems) {
          return parentItems;
        }
      }
    }
    return null;
  }

  return findParent(childId, items);
}

export function flattenItems(items: any) {
  return items.reduce((result: any, item: any) => {
    result.push(item);
    if (item && item.hasOwnProperty("items") && item.items.length > 0) {
      result = result.concat(flattenItems(item.items));
    }
    result.map((item: any) => (item.items = []));
    return result;
  }, []);
}

export function generateRandomId(length: number) {
  let id = "";
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    id += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }

  return id;
}

export function addNode(items, childId, value) {
  if (childId === undefined) {
    items.push(value);

    return items;
  } else {
    const parent = getItem(childId, items);
    parent.items.push(value);

    return items;
  }
}

export function removeNode(childId, items) {
  if (childId === undefined) {
    const index = items.findIndex((item) => item.id === childId);
    items.splice(index, 1);

    return items;
  } else {
    const parentItems = getParentArray(childId, items);
    const index = parentItems.findIndex((item) => item.id === childId);
    parentItems.splice(index, 1);

    return parentItems;
  }
}

export function updateNode(items, childId, value) {
  if (childId === undefined) {
    return value;
  } else {
    const parent = getItem(childId, items);

    parent.items = value;
  }

  return items;
}

// export function manipulateData(data, operation, id, node) {
//   switch (operation) {
//     case "add":
//       if (id === undefined) {
//         return {
//           ...data,
//           items: [...data.items, node]
//         };
//       } else {
//         const parent = findNodeById(data, id);
//         if (parent) {
//           parent.items.push(node);
//         }
//       }
//       break;
//     case "remove":
//       if (id === undefined) {
//         data.items.splice(0, 1);
//       } else {
//         const parent = findParentById(data, id);
//         if (parent) {
//           parent.items.splice(findIndexById(parent.items, id), 1);
//         }
//       }
//       break;
//     case "update":
//       if (id === undefined) {
//         data = node;
//       } else {
//         const target = findNodeById(data, id);

//         console.log(target);

//         if (target) {
//           Object.assign(target, node);
//         }
//       }
//       break;
//     default:
//       console.log("Invalid operation");
//   }
//   return data;
// }

// function findNodeById(node, id) {
//   // if (node.id === id) {
//   //   return node;
//   // }
//   // for (let i = 0; i < node.items.length; i++) {
//   //   const found = findNodeById(node.items[i], id);
//   //   if (found) {
//   //     return found;
//   //   }
//   // }

//   if (id === undefined) {
//     return items;
//   }

//   function findParent(id, node) {
//     for (const item of node) {
//       if (item.id === id) {
//         return item;
//       } else if (item.items.length > 0) {
//         const parentItems = findParent(id, item.items);
//         if (parentItems) {
//           return parentItems;
//         }
//       }
//     }
//     return null;
//   }

//   return findParent(id, node);
// }

// function findParentById(node, id) {
//   for (let i = 0; i < node.items.length; i++) {
//     const item = node.items[i];
//     if (item.id === id) {
//       return node;
//     }
//     const parent = findParentById(item, id);
//     if (parent) {
//       return parent;
//     }
//   }
// }

// function findIndexById(items, id) {
//   for (let i = 0; i < items.length; i++) {
//     if (items[i].id === id) {
//       return i;
//     }
//   }
// }
