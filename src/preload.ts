const electron = window.require("electron");
const { ipcRenderer } = electron;

// contextBridge.exposeInMainWorld("api",{
//     dbq: (args) => {
//         console.log(ipcRenderer.invoke('db-query', args))
//     }
// })

// export function send(args: any) {
//   return new Promise((resolve) => {
//     ipcRenderer.once("db-query", (_: any, args: any) => {
//       resolve(args);
//     });
//     ipcRenderer.send("db-query", args);
//   });
// }

// Adding Items
export const addItem = (args: object) => {
  return new Promise((resolve) => {
    ipcRenderer.once("query_addItem", (_: any, args: any) => {
      resolve(args);
    });

    ipcRenderer.send("query_addItem", args);
  });
};

// Adding Categories
export const addCategory = (args: object) => {
  return new Promise((resolve) => {
    ipcRenderer.once("query_addCategory_reply", (_: any, args: any) => {
      resolve(args);
    });

    ipcRenderer.send("query_addCategory", args);
  });
};

export const addOrderToDB = (args: object) => {
  return new Promise((resolve) => {
    ipcRenderer.once("query_addOrder_reply", (_: any, args: any) => {
      resolve(args);
    });
    ipcRenderer.send("query_addOrder", args);
  });
};

// = = = READ = = =

//Query Categories
export const getCategories = (args: any) => {
  return new Promise((resolve) => {
    ipcRenderer.once("query_allCategories_reply", (_: any, args: any) => {
      resolve(args);
    });

    ipcRenderer.send("query_allCategories", args);
  });
};
//Query items in specific categories
export const getItemsInCategory = (args: any) => {
  return new Promise((resolve) => {
    ipcRenderer.once("query_itemsInCategory_reply", (_: any, args: any) => {
      resolve(args);
    });

    ipcRenderer.send("query_itemsInCategory", args);
  });
};

// Query all items
export const getAllItems =(args: object) =>{
  return new Promise((resolve)=>{
    ipcRenderer.once('query_allItems_reply', (_: any, args:any) => {
      resolve(args)
    })

    ipcRenderer.send('query_allItems', args)
  })
}

//Search Item name by wildcard 
export const searchItem  = (args: object) =>{
  return new Promise((resolve) =>{
    ipcRenderer.on('search_items_reply',(_:any, args:any)=>{
      resolve(args)
    })

    ipcRenderer.send('search_items', args)
  })
}

//get item statistics for current month
export const getCurrentMonthItemStatistics = (args: object) =>{
  return new Promise((resolve) =>{
    ipcRenderer.on('query_item_sales_current_month_reply', (_:any, args:any)=>{
      resolve(args)
    })
    ipcRenderer.send('query_item_sales_current_month', args)
  })
}
