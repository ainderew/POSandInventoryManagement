const { app, BrowserWindow, ipcMain } = require("electron"); // electron
const isDev = require("electron-is-dev"); // To check if electron is in development mode
const path = require("path");
const sqlite3 = require("sqlite3");

let mainWindow;

const db = new sqlite3.Database(
  isDev
    ? path.join(app.getAppPath(), "./db/test.db") // my root folder if in dev mode
    : path.join(app.getAppPath(), "db/test.db"), // the resources path if in production build
  (err) => {
    if (err) {
      console.log(`Database Error: ${err}`);
    } else {
      console.log("Database Loaded");
    }
  }
);

// Initializing the Electron Window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280, // width of window
    height: 720, // height of window
    webPreferences: {
      // IMPORTANT!!!! COMMENTED OUT PRELOADS. UNCOMMENT IF ISSUES ARISE
      // IMPORTANT! - IMPORTRANT! - IMPORTANT! - IMPORTANT!

      // The preload file where we will perform our app communication
      // preload: isDev
      //   ? path.join(app.getAppPath(), "./public/preload.js") // Loading it from the public folder for dev
      //   : path.join(app.getAppPath(), "./build/preload.js"), // Loading it from the build folder for production
      worldSafeExecuteJavaScript: true, // If you're using Electron 12+, this should be enabled by default and does not need to be added here.
      contextIsolation: false, // Isolating context so our app is not exposed to random javascript executions making it safer.
      nodeIntegration: true,
    },
    fullscreen: false,
    autoHideMenuBar: true,
  });

  // Loading a webpage inside the electron window we just created
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Loading localhost if dev mode
      : `file://${path.join(__dirname, "../build/index.html")}` // Loading build file if in production
  );

  // Setting Window Icon - Asset file needs to be in the public/images folder.
  mainWindow.setIcon(path.join(__dirname, "images/appicon.ico"));

  // In development mode, if the window has loaded, then load the dev tools.
  if (isDev) {
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  }
};

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
app.setPath(
  "userData",
  isDev
    ? path.join(app.getAppPath(), "userdata/") // In development it creates the userdata folder where package.json is
    : path.join(process.resourcesPath, "userdata/") // In production it creates userdata folder in the resources folder
);

// When the app is ready to load
app.whenReady().then(async () => {
  await createWindow(); // Create the mainWindow

  // If you want to add React Dev Tools
  if (isDev) {
    await session.defaultSession
      .loadExtension(
        path.join(__dirname, `../userdata/extensions/react-dev-tools`) // This folder should have the chrome extension for React Dev Tools. Get it online or from your Chrome extensions folder.
      )
      .then((name) => console.log("Dev Tools Loaded"))
      .catch((err) => console.log(err));
  }
});

// Exiting the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Activating the app
app.on("activate", () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on("uncaughtException", (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ipcMain.handle("db-query", async (events, args) => {
//   db.get(`SELECT * FROM tblTest`, (err, data) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     // console.log(data[0]);
//     return new Promise((resolve, reject) =>{
//       if(err){
//         reject(error)
//       }else{
//         console.log(data)
//         resolve(data)
//       }
//     })
//   });
// });

// ipcMain.handle("db-query", async (events, args) => {

//   const datar = db.exec(`SELECT * FROM tblTest`)
//   console.log(datar.all())

// })

// ipcMain.on("db-query", (event, args) => {
//   console.log(args.test);

//   db.get("SELECT name FROM tblTest WHERE id = 1", (err, data) => {
//     console.log(data);
//     event.reply("db-query", data);
//   });
// });

// ========== CREATE ================

// - - - - Add Orders

ipcMain.on("query_addOrder", (event, args) => {
  const { orderData, totalProfit, totalRevenue } = args;

  console.log(args);

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const hh = String(today.getHours()).padStart(2, "0");
  const min = String(today.getMinutes()).padStart(2, "0");
  today = `${mm}/${dd}/${yyyy}`;
  time = `${hh}:${min}`;

  const handleInventory = (itemID, orderedQty) => {
    const query = `UPDATE tblItems SET itemQuantity = itemQuantity - ? WHERE itemID = ?`;
    db.run(query, [orderedQty, itemID], (err) => {
      if (err) {
        console.log("Inventory Handle Error: " + err);
        return err;
      }
    });
  };

  const handleItems = (orderID) => {
    orderData.map((item) => {
      const {itemID, retailPrice, quantity} = item;

      handleInventory(itemID, quantity);

      const query = `INSERT INTO tblOrderDetails (orderID, itemID, priceWhenOrdered, quantityOfOrdered) VALUES (?,?,?,?)`;
      db.run(
        query,
        [orderID, itemID, retailPrice, quantity],
        (err) => {
          if (err) {
            console.log("Item Handle Error: " + err);
            return err;
          }
        }
      );
    });
  };

  const query = `INSERT INTO tblOrders (transactionDate,cashierName,cashierNumber,transactionLocation,transactionTime,totalAmount, profit) VALUES ('${today}', "Andrew", 1, "Palompon",'${time}','${String(
    totalRevenue
  )}','${String(totalProfit)}')`;
  db.run(query, function (err) {
    //Must use old school function instead of lamda function to acces this.lastID
    handleItems(this.lastID);

    event.reply(
      "query_addOrder_reply",
      err || {
        transactionID: this.lastID,
        date: today,
        time: time,
        status: "success",
      }
    );
  });
});

// - - - - Add Items

ipcMain.on("query_addItem", (event, args) => {
  const { barcode, name, quantity, wholePrice, retailPrice, categoryID } = args;

  const query = `
  INSERT INTO 
    tblItems (barcode, itemName, itemQuantity, wholePrice, retailPrice, categoryID) 
  VALUES
    (?,?,?,?,?,?)
  `;

  db.all(
    query,
    [
      barcode,
      name,
      parseInt(quantity),
      wholePrice,
      retailPrice,
      parseInt(categoryID),
    ],
    (err, row) => {
      event.reply("query_addItem", err || row);
    }
  );
});

// - - - - - - Add Category

ipcMain.on("query_addCategory", (event, args) => {
  const { categoryName } = args;

  const query = `
  INSERT INTO 
    tblCategory (categoryName) 
  VALUES
    (?)
  `;

  db.all(query, [categoryName], (err, row) => {
    event.reply("query_addCategory_reply", err || row);
  });
});

// ================ READ ================
ipcMain.on("query_allCategories", (event, args) => {
  const query = `SELECT categoryId, categoryName FROM tblCategory`;

  db.all(query, (err, rows) => {
    event.reply("query_allCategories_reply", err || rows);
  });
});

//  --- Query Items in specific Category
ipcMain.on("query_itemsInCategory", (event, args) => {
  const { categoryID } = args;
  const query = `SELECT itemID, itemName, itemQuantity, retailPrice, wholePrice, barcode FROM tblItems WHERE categoryID = ?`;

  db.all(query, [categoryID], (err, rows) => {
    event.reply("query_itemsInCategory_reply", err || rows);
  });
});

// --- Query All Items
ipcMain.on("query_allItems", (event, args) => {
  const query = `SELECT i.itemID, i.itemName, i.itemQuantity, i.wholePrice, i.retailPrice, i.barcode, c.categoryName, c.categoryID 
  FROM tblItems i 
  INNER JOIN tblCategory c 
  ON i.categoryID = c.categoryID`;

  db.all(query, (err, rows) => {
    event.reply("query_allItems_reply", err || rows);
  });
});

// --- Query order informations by month ---
ipcMain.on("query_orders_information", (event, args) => {
  let d = new Date();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();

  const query = `
  SELECT orderID, transactionDate, transactionTime, totalAmount, profit 
  FROM tblOrders 
  WHERE transactionDate LIKE '0${month}%${year}'`;

  db.all(query, (err, rows) => {
    event.reply("query_orders_information_reply", err || rows);
  });
});

// --- Query items using wildcard ---
ipcMain.on("search_items", (event, args) => {
  const { name } = args;
  const query = `SELECT i.itemID, i.itemName, i.itemQuantity, i.wholePrice, i.retailPrice, i.barcode, c.categoryName 
  FROM tblItems i 
  INNER JOIN tblCategory c 
  ON i.categoryID = c.categoryID 
  WHERE i.itemName LIKE '%${name}%'
  `;

  db.all(query, (err, rows) => {
    event.reply("search_items_reply", err || rows);
  });
});

// --- item statistics for current month
ipcMain.on("query_item_sales_current_month", (event, args) => {
  const { itemID, month } = args;
  let d = new Date();
  let curYear = d.getFullYear();

  const query = `SELECT d.quantityOfOrdered, o.transactionDate, o.transactionTime, i.itemName, i.wholePrice, i.retailPrice, i.itemQuantity
  FROM tblOrderDetails d
  INNER JOIN tblOrders o ON d.orderID = o.orderID
  INNER JOIN tblItems i ON d.itemID = i.itemID
  WHERE d.itemID = ? AND o.transactionDate LIKE '${month}%${curYear}'
  `;

  db.all(query, [itemID], (err, rows) => {
    console.log(rows);
    event.reply("query_item_sales_current_month_reply", err || rows);
  });
});
