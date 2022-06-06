import CategoryContainer from "../components/category-container.components";
import React, { useEffect, useState, useRef } from "react";
// COMPONENTS
import ItemContainer from "../components/item-container.components";
import SearchBar from "../components/search-bar.component";
import OrderedItemContainer from "../components/ordered-items-container.components";
import Receipt from "../components/receipt.component";
// FUNCTIONS
import { addOrderToDB, getCategories, getItemsInCategory } from "../preload";
import { toCurrencyString } from "../scripts/common";
import ModalEditOrderItem from "../components/modal-editOrderItem";
import { throws } from "assert";
import ModalCustomerPayment from "../components/modal-customerPayment.component";
import ModalTransactionConfirmation from "../components/modal-transactionConfirmation";

const Cashier: React.FC = () => {
  const [Categories, setCategories] = useState<object[]>([]);
  const [Items, setItems] = useState<object[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalWholePrice, setTotalWholePrice] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [transactionData, setTransactionData] = useState<object>();
  const [customerPayment, setCustomerPayment] = useState<string>("");

  //FLAGS
  const [receiptFlag, setReceiptFlag] = useState<boolean>(false);
  const [editOrderItemFlag, setEditOrderItemFlag] = useState<boolean>(false);
  const [customerPaymentFlag, setCustomerPaymentFlag] =
    useState<boolean>(false);
  const [transactionConfirmationFlag, setTransactionConfirmationFlag] =
    useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>("");

  const bar = useRef<HTMLInputElement>(null);
  const selectBarcode = () => {
    if (bar.current) {
      bar.current.focus();
      console.log("slkdjf");
    }
  };
  const queryCategories = async () => {
    const nCategories: any = await getCategories({});
    setCategories(nCategories);
  };

  const queryItemsInCategories = async (categoryID: string) => {
    const nItems: any = await getItemsInCategory({ categoryID: categoryID });
    setItems(nItems);
  };

  const hasStock = (itemData: any): boolean => {
    if (itemData.itemQuantity > 0) {
      return true;
    }
    return false;
  };

  const isQuantityOverload = (index: number = 0): boolean => {
    if (orderedItems[index].quantity >= orderedItems[index].itemQuantity) {
      return true;
    }
    return false;
  };

  const addToOrder = (itemData: any): void => {
    getTotalWholePrice("add", itemData.wholePrice);

    const nIndex = checkIfExists(itemData);
    if (nIndex !== -1) {
      // if it exist (returned anything but -1)
      if (isQuantityOverload(nIndex)) {
        return;
      }
      const tempHolder = [...orderedItems];
      tempHolder[nIndex].quantity += 1;
      setOrderedItems(tempHolder);
      return;
    }

    // if ordered item doesn't exist in the current order list check if it's in stock and instantiate a new item Object
    if (hasStock(itemData)) {
      const itemObj = {
        ...itemData,
        quantity: 1,
      };
      const newOrderArray: object[] = [...orderedItems, itemObj];
      setOrderedItems(newOrderArray);
    }
    return;
  };

  const handleEditOrderedItemSave = (newItemData: any, index: number) => {
    let temp = [...orderedItems];
    temp[index] = newItemData;

    setOrderedItems(temp);
    setEditOrderItemFlag(false);
  };

  const handleOrderedItemDelete = (indexOfSelectedItem: number) => {
    let temp = [...orderedItems];
    temp.splice(indexOfSelectedItem, 1);

    setOrderedItems(temp);
    closeModal(setEditOrderItemFlag);
  };

  const resetCashier = () => {
    setOrderedItems([]);
    setItems([]);
    setTotalRevenue(0);
    setReceiptFlag(false);
  };

  const checkIfExists = (newItem: any) => {
    return orderedItems.findIndex((el: any) => el.itemID === newItem.itemID);
  };

  const getTotalRevenue = (): void => {
    let total = orderedItems
      .map((el) => el.retailPrice * el.quantity)
      .reduce((prev, next) => prev + next, 0);
    //  console.log(total)
    setTotalRevenue(numberTwoDecimalPlaces(total));
  };

  const getTotalWholePrice = (
    operation: "add" | "sub",
    itemWholePrice: string
  ) => {
    if (operation === "add") {
      setTotalWholePrice((prev) => (prev += parseFloat(itemWholePrice)));
      return;
    }
  };

  const numberTwoDecimalPlaces = (value: number): number => {
    return parseFloat(value.toFixed(2));
  };

  const closeModal = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ): void => {
    setter(false);
  };

  //FOR TRANSACTION HANDLING
  const openCustomerPaymentModal = () => {
    if (orderedItems.length === 0) {
      return;
    }
    setCustomerPaymentFlag(true);
  };

  const processOrder = async () => {
    const response: any = await addOrderToDB({
      orderData: orderedItems,
      totalRevenue: totalRevenue,
      totalProfit: totalProfit,
    });

    if (response.status === "success") {
      //trigger receipt print
      readyReceipts(response);
    }
  };

  const readyReceipts = (orderData: any) => {
    setTransactionData(orderData);
    setReceiptFlag(true);
    //add transaction type, cashier name, cashier machine number, and transaction id
  };

  // USEEFFECTS

  useEffect(() => {
    queryCategories();
  }, []);

  // everytime totalRevenue changes it computes for the profit and stores it in totalProfit
  useEffect(() => {
    // setTotalProfit(parseFloat((totalRevenue - totalWholePrice).toFixed(2)))
    const profit = totalRevenue - totalWholePrice;
    setTotalProfit(numberTwoDecimalPlaces(profit));
  }, [totalRevenue]);

  useEffect(() => {
    getTotalRevenue();
  }, [orderedItems]);

  return (
    <div
      onClick={selectBarcode}
      className="cashier h-screen w-full grid grid-cols-[1fr_25rem] "
    >
      <input ref={bar} type="text" className="absolute top-0 bg-slate-300" />
      {receiptFlag ? (
        <Receipt
          orderData={orderedItems}
          totalOrderPrice={totalRevenue}
          transactionData={transactionData}
          resetCashierFunction={resetCashier}
          customerPayment={customerPayment}
        />
      ) : null}

      {editOrderItemFlag ? (
        <ModalEditOrderItem
          passedOrderedItemData={orderedItems[selectedItemIndex]}
          selectedItemIndex={selectedItemIndex}
          handleSave={handleEditOrderedItemSave}
          handleDelete={handleOrderedItemDelete}
          closeModal={() => closeModal(setEditOrderItemFlag)}
        />
      ) : null}

      {customerPaymentFlag ? (
        <ModalCustomerPayment
          customerPayment={customerPayment}
          setCustomerPayment={setCustomerPayment}
          setModalFlag={setCustomerPaymentFlag}
          nextModalFlag={setTransactionConfirmationFlag}
        />
      ) : null}

      {transactionConfirmationFlag ? (
        <ModalTransactionConfirmation
          totalAmount={totalRevenue}
          customerPayment={customerPayment}
          modalSetter={setTransactionConfirmationFlag}
          processOrder={processOrder}
        />
      ) : null}

      <div className="middle grid grid-rows-[3rem_3rem_1fr] overflow-hidden">
        <div className="border-b-2 border-grey-300 p-2">
          <SearchBar
            searchInputSetter={setSearchInput}
            searchInput={searchInput}
          />
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
                  quantity={el.itemQuantity}
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
          {orderedItems.map((item: any, index: number) => {
            return (
              <OrderedItemContainer
                key={item.itemID}
                orderedItemData={item}
                setterFlag={setEditOrderItemFlag}
                setterIndex={setSelectedItemIndex}
                passedIndex={index}
              />
            );
          })}
        </div>
        <div
          onClick={openCustomerPaymentModal}
          className="bg-green-400 flex justify-center items-center"
        >
          <p className="text-white">{toCurrencyString(totalRevenue)}</p>
        </div>
      </div>
    </div>
  );
};

export default Cashier;
