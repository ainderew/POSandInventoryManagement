import React, { useState, useEffect, useRef } from "react";

interface props {
  passedOrderedItemData: {
    itemID: number;
    itemName: string;
    itemQuantity: number;
    quantity: number;
    retailPrice: string;
    wholePrice: string;
  };
  selectedItemIndex: number;
  handleSave: Function;
  handleDelete: Function;
  closeModal: Function;
}

const ModalEditOrderItem: React.FC<props> = ({
  passedOrderedItemData,
  selectedItemIndex,
  handleSave,
  handleDelete,
  closeModal
}: props) => {
  const [orderedItemData, setOrderedItemData] = useState<any>(
    passedOrderedItemData
  );

  //   SETS THE STYLE OF THE INPUT'S BORDER TO RED IF IT IS BLANK
  let inputStyle = {
    border: "1px solid black",
  };

  if (isNaN(orderedItemData.quantity)) {
    inputStyle = {
      border: "2px solid red",
    };
  }
  //   = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderedItemData((prev: any) => ({
      ...prev,
      quantity: parseInt(e.target.value),
    }));
  };

  const handleEnterPressed = (e:React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key === "Enter"){
        handleVerification()
    }
  }

  const handleVerification = () => {
    if (isNaN(orderedItemData.quantity)) {
      return;
    }

    handleSave(orderedItemData, selectedItemIndex);
  };

  return (
    <div className="blur-wrapper bg-[rgba(0,0,0,0.2)] absolute w-screen h-screen left-0 top-0">
      <div className="rounded-lg flex flex-col absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-2">
        <div className="px-4 py-2 header-container flex justify-between items-end shadow-md">
          <p className="font-semibold">Item Information</p>
          <button
          onClick={()=>closeModal()}
          className="border-none bg-gray-200 w-7 h-7 font-medium">
            x
          </button>
        </div>
        <div className="flex flex-col px-10 py-4 gap-2">
          <div className="row flex flex-col items-center ">
            <p className="text-sm leading-tight">Item Name</p>
            <p className="text-lg font-medium leading-tight">{orderedItemData.itemName}</p>
          </div>
          <div className="row">
            <p className="">Quantity</p>
            <input
              onChange={(e) => handleInputChange(e)}
              onKeyDown={(e) => handleEnterPressed(e)}
              type="number"
              className="active:outline-none focus:outline-none p-1"
              min={1}
              autoFocus={true}
              value={orderedItemData.quantity}
              placeholder="Can't Be Blank"
              style={inputStyle}
            />
          </div>
        </div>
        <div className="rounded-b-lg px-4 py-4 flex gap-2 bg-gray-100">
          <button
            onClick={() => handleDelete()}
            className="bg-gray-300  h-8 text-sm flex-grow-[1.5]"
          >
            Remove
          </button>
          <button
            onClick={() => handleVerification()}
            className="border-[1px] bg-main text-white rounded h-8 text-sm flex-grow-[2] active:scale-95 transition-all ease-in-out duration-100"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditOrderItem;
