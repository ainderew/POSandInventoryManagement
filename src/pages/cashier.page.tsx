import CategoryContainer from "../components/category-container.components";
import { useEffect, useState } from "react";
// COMPONENTS
import ItemContainer from "../components/item-container.components";
import SearchBar from "../components/search-bar.component";
import OrderedItemContainer from "../components/ordered-items-container.components";
import Receipt from "../components/receipt.component";
// FUNCTIONS
import { addOrderToDB, getCategories, getItemsInCategory } from "../preload";
import { toCurrencyString } from "../scripts/common";

const Cashier: React.FC = () => {
  const [Categories, setCategories] = useState<object[]>([]);
  const [Items, setItems] = useState<object[]>([]);
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [transactionData, setTransactionData] = useState<object>();
  const [receiptFlag, setReceiptFlag] = useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>("")

  const queryCategories = async () => {
    const nCategories: any = await getCategories({});
    setCategories(nCategories);
  };

  const queryItemsInCategories = async (categoryID: string) => {
    const nItems: any = await getItemsInCategory({ categoryID: categoryID });
    setItems(nItems);
  };

  const addToOrder = (itemData: any) => {
    getTotalAmount("add", itemData.retailPrice);

    const nIndex = checkIfExists(orderedItems, itemData);
    if (nIndex !== -1) {
      const tempHolder = [...orderedItems];
      tempHolder[nIndex].quantity += 1;
      setOrderedItems(tempHolder);
      return;
    }
    const itemObj = {
      ...itemData,
      quantity: 1,
    };
    const newOrderArray: object[] = [...orderedItems, itemObj];
    setOrderedItems(newOrderArray);
  };

  const resetCashier = () => {
    setOrderedItems([]);
    setItems([]);
    setTotalPrice(0);
    setReceiptFlag(false);
  };

  const processOrder = async () => {
    const response: any = await addOrderToDB({ orderData: orderedItems });

    if (response.status === "success") {
      //trigger receipt print
      readyReceipts(response);
    }
  };

  const readyReceipts = (response: any) => {
    setTransactionData(response);
    setReceiptFlag(true);
    //add transaction type, cashier name, cashier machine number, and transaction id
  };

  const checkIfExists = (orderedItemsArray: object[], newItem: any) => {
    return orderedItemsArray.findIndex(
      (el: any) => el.itemID === newItem.itemID
    );
  };

  const getTotalAmount = (operation: "add", itemPrice: string) => {
    if (operation === "add") {
      setTotalPrice((prev) => (prev += parseFloat(itemPrice)));
      return;
    }
    //else do subtract logic
  };

  useEffect(() => {
    queryCategories();
  }, []);

  return (
    <div className="cashier h-screen w-full grid grid-cols-[1fr_25rem] ">
      {receiptFlag ? (
        <Receipt
          orderData={orderedItems}
          totalOrderPrice={totalPrice}
          transactionData={transactionData}
          resetCashierFunction={resetCashier}
        />
      ) : null}
      <div className="middle grid grid-rows-[3rem_3rem_1fr] overflow-hidden">
        <div className="border-b-2 border-grey-300 p-2">
          <SearchBar searchInputSetter={setSearchInput} searchInput ={searchInput} />
        </div>

        <div className="header-container grid grid-cols-2 border-b-2 border-grey-300 ">
          <div className=" px-6 flex items-center">
            <p className="font-semibold text-lg">Categories</p>
          </div>
          <div className="px-6 flex items-center">
            <p className="font-semibold text-lg">Items</p>
          </div>
        </div>
        <div className="grid grid-cols-2 overflow-hidden">
          <div className="middle-left grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3  auto-rows-[14rem] gap-5 p-6 overflow-y-auto">
            {Categories.map((el: any) => {
              return (
                <CategoryContainer
                  key={el.categoryID}
                  clickFunction={queryItemsInCategories}
                  categoryID={el.categoryID}
                  name={el.categoryName}
                  numberOfItems={"21"}
                />
              );
            })}
          </div>
          <div className="middle-right p-6 grid grid-cols-1 auto-rows-[5rem] gap-4 border-l-2 border-grey-300 overflow-y-auto">
            {Items.map((el: any) => {
              return (
                <ItemContainer
                  key={el.itemID}
                  addToOrder={() => addToOrder(el)}
                  name={el.itemName}
                  quantity={2}
                  price={el.retailPrice}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-rows-[6rem_1fr_6rem] border-l-2 border-grey-300 overflow-hidden">
        <div className="flex justify-center items-center flex-col border-b-2 border-grey-400">
          <p className="font-medium  text-lg">Techpal</p>
          <p className="font-light  text-sm">Palompon Leyte</p>
        </div>
        <div className="flex flex-col overflow-y-auto">
          {orderedItems.map((item: any) => {
            return <OrderedItemContainer
            key={item.itemID}
            orderedItemData={item} />;
          })}
        </div>
        <div
          onClick={processOrder}
          className="bg-green-400 flex justify-center items-center"
        >
          <p className="text-white">{toCurrencyString(totalPrice)}</p>
        </div>
      </div>
    </div>
  );
};

export default Cashier;
