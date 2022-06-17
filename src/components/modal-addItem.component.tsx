import React, { useEffect, useState } from "react";

import { addItem, getCategories } from "../preload";
import ModalSuccess from "./modal-success.component";

interface itemProps {
  toggleModal: Function;
  stateSetter: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddItem: React.FC<itemProps> = ({ toggleModal, stateSetter }) => {
  const [barcode, setBarcode] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [qty, setQty] = useState<string>("");
  const [wholePrice, setWholePrice] = useState<string>("");
  const [retailPrice, setRetailPrice] = useState<string>("");
  const [categoryID, setCategoryID] = useState<any>("");

  const [categories, setCategories] = useState<object[]>([]);

  const [successFlag, setSuccessFlag] = useState<boolean>(false);

  useEffect(() => {
    console.log(categoryID);
  }, [categoryID]);

  const clearInputs = () => {
    setBarcode("");
    setItemName("");
    setQty("");
    setWholePrice("");
    setRetailPrice("");
    setCategoryID("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const handleSubmission = async () => {
    const response: any = await addItem({
      barcode: barcode,
      name: itemName,
      quantity: qty,
      wholePrice: wholePrice,
      retailPrice: retailPrice,
      categoryID: categoryID,
    });

    if (response.length === 0) {
      setSuccessFlag(true);

      setTimeout(() => {
        clearInputs();
        setSuccessFlag(false);
      }, 1500);
      return;
    }
  };

  const queryCategories = async () => {
    const nCategories: any = await getCategories({});
    setCategories(nCategories);
  };

  useEffect(() => {
    queryCategories();
  }, []);

  return (
    <div className="h-full w-full bg-[rgba(0,0,0,.3)]  flex justify-center items-center fixed top-0">
      {successFlag ? (
        <ModalSuccess setter={setSuccessFlag} description="You have successfully added an item!" />
      ) : (
        <div className="h-auto w-[30vw] p-4 bg-white z-10 rounded-sm flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Barcode</p>
            <input
              value={barcode}
              onChange={(e) => {
                handleInputChange(e, setBarcode);
              }}
              type="text"
              autoFocus={true}
              className="h-10 rounded border-2 border-gray-200 focus:outline-[#58B7F5] px-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Item Name</p>
            <input
              value={itemName}
              onChange={(e) => {
                handleInputChange(e, setItemName);
              }}
              type="text"
              className="h-10 rounded border-2 border-gray-200 focus:outline-[#58B7F5] px-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Wholesale Price</p>
            <input
              value={wholePrice}
              onChange={(e) => {
                handleInputChange(e, setWholePrice);
              }}
              type="number"
              className="h-10 rounded border-2 border-gray-200 focus:outline-[#58B7F5] px-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Retail Price</p>
            <input
              value={retailPrice}
              onChange={(e) => {
                handleInputChange(e, setRetailPrice);
              }}
              type="number"
              className="h-10 rounded border-2 border-gray-200 focus:outline-[#58B7F5] px-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Quantity</p>
            <input
              value={qty}
              onChange={(e) => {
                handleInputChange(e, setQty);
              }}
              type="number"
              className="h-10 rounded border-2 border-gray-200 focus:outline-[#58B7F5] px-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Category</p>
            <select
              onChange={(e: any) => {
                handleInputChange(e, setCategoryID);
              }}
              className="h-10 rounded border-2 border-gray-200 focus:outline-[#58B7F5] px-1"
            >
              {" "}
              <option selected={true} disabled={true} value="">
                Select a category
              </option>
              {categories.map((el: any) => {
                return (
                  <option value={el.categoryID} className="">
                    {el.categoryName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mt-4 grid grid-cols-[1.5fr_1fr] gap-2">
            <button
              onClick={handleSubmission}
              className="w-full h-10 bg-[#58B7F5] text-white text-sm font-medium"
            >
              Save Item
            </button>
            <button
              onClick={() => toggleModal(stateSetter)}
              className="w-full h-10 bg-white border-2 border-gray-300 text-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalAddItem;
